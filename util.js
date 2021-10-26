const DISCORD_CDN = 'https://cdn.discordapp.com'

export function userAvatar({id, discriminator, avatar}, {size = 512}) {
    if (avatar) {
        return `${DISCORD_CDN}/avatars/${id}/${avatar}.webp?size=${size}`
    } else {
        return `${DISCORD_CDN}/embed/avatars/${parseInt(discriminator) % 5}.png?size=${size}`
    }
}

export function guildIcon({id, icon}, {size = 512}) {
    if (!icon) return null

    return `${DISCORD_CDN}/icons/${id}/${icon}.webp?size=${size}`
}

export function hasBitFlag(value, bit) {
    if (!value) return false

    const shifted = 1 << bit;
    return (value & shifted) === shifted
}

export function formatDateTime(date) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000)
    return formatDateTime(date)
}

export function apiUrl(path, external = false) {
    path = path.replace(/^\//g, '').replace(/\/$/g, '')
    if (!process.browser) {
        if (external) {
            return `${process.env.API_URL_EXTERNAL}/${path}`
        } else {
            return `${process.env.API_URL_INTERNAL}/${path}`
        }
    } else {
        return `/api/${path}`
    }
}

export function apiRequest(path, options = {}) {
    return fetch(
        apiUrl(path),
        {
            headers: {
                'Authorization': options.token,
                'Content-Type': 'application/json'
            },
            body: options.data ? JSON.stringify(options.data) : undefined,
            ...options
        }
    )
}