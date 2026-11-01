import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import nodemailer from 'nodemailer'

// In-memory OTP cache for the server
const otpStore = new Map()
let cachedTransporter = null

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter
  try {
    const testAccount = await nodemailer.createTestAccount()
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  } catch (err) {
    console.error('[Zelo Server] Error creating email transporter:', err)
  }
  return cachedTransporter
}

// Built-in Email & OTP Server Plugin for Vite
function zeloEmailServerPlugin() {
  return {
    name: 'zelo-email-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Endpoint 1: Send OTP to Email
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const { email } = JSON.parse(body || '{}')
              if (!email) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                return res.end(
                  JSON.stringify({ success: false, message: 'Email is required' })
                )
              }

              const cleanEmail = email.trim().toLowerCase()
              const otp = Math.floor(100000 + Math.random() * 900000).toString()

              // Save in server store with 5 minutes expiry
              otpStore.set(cleanEmail, {
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
              })

              let previewUrl = null
              try {
                const transporter = await getTransporter()
                if (transporter) {
                  const info = await transporter.sendMail({
                    from: '"Zelo Security" <security@zelo.com>',
                    to: cleanEmail,
                    subject: 'Zelo Account Verification Code (OTP)',
                    text: `Your Zelo account recovery verification code is: ${otp}. It expires in 5 minutes.`,
                    html: `
                      <div style="font-family: system-ui, sans-serif; max-width: 480px; padding: 28px; border: 1px solid #e5e7eb; border-radius: 16px; margin: 0 auto; background: #ffffff;">
                        <h2 style="color: #f59e0b; margin: 0 0 10px 0; font-size: 22px;">Zelo Security</h2>
                        <p style="color: #374151; font-size: 14px; margin-bottom: 20px;">
                          You recently requested to reset your password. Use the verification code below to proceed:
                        </p>
                        <div style="background: #fef3c7; border: 1px dashed #f59e0b; padding: 14px 20px; font-size: 30px; font-weight: 800; letter-spacing: 8px; text-align: center; border-radius: 12px; margin: 20px 0; color: #111827;">
                          ${otp}
                        </div>
                        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
                          This code will expire in 5 minutes. If you did not request this, please ignore this email.
                        </p>
                      </div>
                    `,
                  })
                  previewUrl = nodemailer.getTestMessageUrl(info)
                }
              } catch (mailErr) {
                console.error('[Zelo Server] Email dispatch error:', mailErr)
              }

              // Prominent Terminal Log
              console.log('\n============================================================')
              console.log('📧 [ZELO SERVER] NEW OTP DISPATCHED TO EMAIL')
              console.log(`   To: ${cleanEmail}`)
              console.log(`   OTP Code: >>> ${otp} <<< (Valid for 5 mins)`)
              if (previewUrl) {
                console.log(`   Live Email Inbox Preview: ${previewUrl}`)
              }
              console.log('============================================================\n')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, otp, previewUrl }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        // Endpoint 2: Verify OTP
        if (req.url === '/api/verify-otp' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { email, otp } = JSON.parse(body || '{}')
              const cleanEmail = String(email || '').trim().toLowerCase()
              const record = otpStore.get(cleanEmail)

              if (!record) {
                res.setHeader('Content-Type', 'application/json')
                return res.end(
                  JSON.stringify({
                    success: false,
                    message: 'No OTP requested for this email or it has expired.',
                  })
                )
              }

              if (Date.now() > record.expiresAt) {
                otpStore.delete(cleanEmail)
                res.setHeader('Content-Type', 'application/json')
                return res.end(
                  JSON.stringify({
                    success: false,
                    message: 'OTP has expired. Please request a new code.',
                  })
                )
              }

              if (record.otp !== String(otp).trim()) {
                res.setHeader('Content-Type', 'application/json')
                return res.end(
                  JSON.stringify({
                    success: false,
                    message:
                      'Incorrect OTP code! Please enter the exact 6-digit code received.',
                  })
                )
              }

              // Successfully verified! Clear OTP
              otpStore.delete(cleanEmail)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), zeloEmailServerPlugin()],
})
