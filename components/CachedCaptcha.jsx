import HCaptcha from "@hcaptcha/react-hcaptcha";
import {useRef, useImperativeHandle, forwardRef} from 'react'

let lastToken = null

const CachedCaptcha = forwardRef(({onVerify, ...options}, ref) => {
    const captchaRef = useRef(null)

    useImperativeHandle(ref, () => ({
        execute: () => {
            if (lastToken) {
                onVerify(lastToken)
            } else {
                captchaRef.current.execute()
            }
        },
        invalidateCache: () => {
            lastToken = null
        }
    }))

    return (
        <HCaptcha
            sitekey="f1dc7048-6eac-456f-9d84-37a69851f7e1"
            theme="dark"
            size="invisible"
            ref={captchaRef}
            onVerify={token => {
                lastToken = token
                onVerify(token)
            }}
            {...options}
        />
    )
})

export default CachedCaptcha
