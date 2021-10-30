import {WidgetInstance} from 'friendly-challenge';

const DISCORD_CDN = 'https://cdn.discordapp.com'

export function userAvatar({id, discriminator, avatar}, {size = 512}) {
    if (avatar) {
        if (avatar.startsWith('a_')) {
            return `${DISCORD_CDN}/avatars/${id}/${avatar}.gif?size=${size}`
        } else {
            return `${DISCORD_CDN}/avatars/${id}/${avatar}.webp?size=${size}`
        }
    } else {
        return `${DISCORD_CDN}/embed/avatars/${parseInt(discriminator) % 5}.png?size=${size}`
    }
}

export function userBanner({id, banner}) {
    if (!banner) return null

    if (banner.startsWith('a_')) {
        return `https://cdn.discordapp.com/banners/${id}/${banner}.gif?size=1024`
    } else {
        return `https://cdn.discordapp.com/banners/${id}/${banner}.webp?size=1024`
    }
}

export function guildIcon({id, icon}, {size = 512}) {
    if (!icon) return null

    return `${DISCORD_CDN}/icons/${id}/${icon}.webp?size=${size}`
}

export function applicationIcon({id, icon}, {size = 128}) {
    if (icon) {
        return `https://cdn.discordapp.com/app-icons/${id}/${icon}.webp?size=${size}`
    } else {
        return `${DISCORD_CDN}/embed/avatars/0.png?size=${size}`
    }
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

export function intToHexColor(int) {
    if (!int) return null

    var hex = Number(int).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return `#${hex}`;
}

export function apiRequest(path, options = {}) {
    return fetch(
        apiUrl(path),
        {
            headers: {
                'Authorization': options.token,
                'Content-Type': 'application/json',
                'Captcha-Solution': options.captcha
            },
            body: options.data ? JSON.stringify(options.data) : undefined,
            ...options
        }
    )
}

export function solveCaptcha() {
    return new Promise((resolve, reject) => {
        const element = document.createElement('div')
        element.setAttribute('data-sitekey', 'none')
        element.setAttribute('data-puzzle-endpoint', 'https://captcha.distools.app/puzzle')

        new WidgetInstance(element, {
            startMode: "auto",
            doneCallback: token => {
                element.remove()
                resolve(token)
            },
            errorCallback: () => {
                element.remove()
                reject()
            },
            // readyCallback: () => solver.start(),
        });
    })
}