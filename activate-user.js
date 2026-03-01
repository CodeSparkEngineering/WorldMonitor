import { Redis } from '@upstash/redis'
import 'dotenv/config'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

async function activateUser(email) {
    if (!email) {
        console.log('❌ Please provide an email address. Example: node activate-user.js client@email.com')
        return
    }

    const emailKey = email.toLowerCase().trim()
    const uid = await redis.get(`email:${emailKey}`)

    if (!uid) {
        console.log(`❌ No user found for email: ${emailKey}`)
        return
    }

    console.log(`✅ Found user: ${uid}`)

    // 1. Grant subscription access (32 days for monthly)
    await redis.set(`sub:${uid}`, 'active', { ex: 32 * 24 * 60 * 60 })

    // 2. Update customer profile
    const existing = await redis.get(`customer:${uid}`)
    if (existing) {
        const now = new Date().toISOString()
        const profile = {
            ...existing,
            subscriptionStatus: 'active',
            plan: 'analyst',
            subscribedAt: now,
            lastPaymentAt: now
        }
        await redis.set(`customer:${uid}`, profile, { ex: 365 * 24 * 60 * 60 })
        console.log(`✅ Profile updated to ACTIVE for ${emailKey}`)
    } else {
        console.log(`⚠️ Profile object missing for ${uid}, but access was granted.`)
    }

    console.log(`\n🎉 Success! The user ${email} now has full access to the dashboard.`)
}

const args = process.argv.slice(2)
activateUser(args[0])
