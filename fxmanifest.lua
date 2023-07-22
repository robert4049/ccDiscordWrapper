-- Resource Metadata
fx_version 'cerulean'
games { 'rdr3', 'gta5' }

author 'Concept Collective <contact@conceptcollective.net>'
description 'ccDiscordWrapper - Discord Wrapper for FiveM'
version '1.0.0'

-- What to run
client_scripts {
    'client/main.js',
}
server_scripts { 
    'server/main.js',
    'env.js',
}

files {
    'config.jsonc'
}

server_exports {
    'sendNewMessage',
    'webhookSendNewMessage',
    'getPlayerDiscordAvatar',
    'getPlayerDiscordHighestRole'
}                                                                                          -- Automatic version checker to keep this script up-to-date