import React, {useState} from "react";
import {useGuilds} from "../../hooks/guilds";
import {guildIcon} from "../../util";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function SelectGuild({selectedGuild, guildSelected}) {
    const guilds = useGuilds()

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className="flex-auto mr-3 relative" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="flex items-center px-4 py-2 bg-dark-4 rounded-md cursor-pointer">
                <div className="flex-auto">
                    {selectedGuild ? (
                        <div className="flex items-center max-w-xs">
                            <img src={guildIcon(selectedGuild, {size: 128})} alt="" className="w-7 h-7 rounded-full mr-2"/>
                            <div className="text-lg truncate">{selectedGuild.name}</div>
                        </div>
                    ) : (
                        <div className="text-xl">Selected Server</div>
                    )}
                </div>
                <FontAwesomeIcon icon={faChevronDown}/>
            </div>

            <div
                className={`absolute bg-dark-5 py-3 top-14 rounded-md ${menuOpen ? 'block' : 'hidden'} max-h-96 overflow-y-auto`}>
                {guilds ? guilds.map(guild => (
                    <div className="flex items-center max-w-xs px-3 py-1 hover:bg-dark-4 cursor-pointer" onClick={() => guildSelected(guild)}>
                        <img src={guildIcon(guild, {size: 128})} alt="" className="w-10 h-10 rounded-full mr-2"/>
                        <div className="text-lg truncate">{guild.name}</div>
                    </div>
                )) : ''}
            </div>
        </div>
    )
}