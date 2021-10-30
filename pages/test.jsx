import {useEffect, useRef} from 'react';
import { WidgetInstance } from 'friendly-challenge';

export default function Test() {
    const container = useRef(null);
    const widget = useRef(null);

    const doneCallback = (solution) => {
        console.log('Captcha was solved. The form can be submitted.');
        console.log(solution);
        widget.current.reset()
    }

    const errorCallback = (err) => {
        console.log('There was an error when trying to solve the Captcha.');
        console.log(err);
    }

    useEffect(() => {
        if (!widget.current && container.current) {
            widget.current = new WidgetInstance(container.current, {
                startMode: "none",
                doneCallback: doneCallback,
                errorCallback: errorCallback,
                readyCallback: () => {widget.current.start(); console.log('start')}
            });
        }

        return () => {
            if (widget.current) widget.current.reset();
        }
    }, [container]);

    return (
        <div ref={container} className="frc-captcha dark" data-sitekey="none" data-puzzle-endpoint="https://captcha.distools.app/puzzle"/>
    );
}