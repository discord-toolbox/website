import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink, faHashtag} from "@fortawesome/free-solid-svg-icons";
import React from 'react'
import {useState} from 'react'
import SelectGuild from "./SelectGuild";

export default function SendMessage({mode, modeChanged}) {
    const [selectedGuild, setSelectedGuild] = useState(null)
    const [selectedChannel, setSelectedChannel] = useState(null)
    const [selectedMessage, setSelectedMessage] = useState(null)

    const [webhookUrl, setWebhookUrl] = useState('')
    const [messageId, setMessageId] = useState('')

    function toggleMode() {
        modeChanged(mode === 'webhook' ? 'channel' : 'webhook')
    }

    function sendMessage() {

    }

    return (
        <div className="flex">
            <button className="flex-initial rounded-md bg-dark-4 mr-3 text-lg cursor-pointer px-3 text-2xl"
                    onClick={toggleMode}>
                <FontAwesomeIcon icon={mode === 'webhook' ? faLink : faHashtag}/>
            </button>
            {mode === 'webhook' ? (
                <div className="flex items-center flex-auto">
                    <div className="flex-auto rounded-md bg-dark-4 mr-3">

                    </div>
                    <div className="flex-auto rounded-md bg-dark-4 mr-3">

                    </div>
                </div>
            ) : (
                <div className="flex items-center flex-auto">
                    <SelectGuild selectedGuild={selectedGuild} guildSelected={setSelectedGuild}/>
                    <SelectGuild selectedGuild={selectedGuild} guildSelected={setSelectedGuild}/>
                    <SelectGuild selectedGuild={selectedGuild} guildSelected={setSelectedGuild}/>
                </div>
            )}
            <div className="flex-initial">
                <button className="px-3 py-2 rounded-md bg-green-500 hover:bg-green-600 text-lg" onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    )
}