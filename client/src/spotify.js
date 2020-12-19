export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://localhost:3000";
const clientId = "ba062424c7eb4bd5affd0bffdb72fa65"

const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "user-read-recently-played",
    "user-library-read",
    "user-library-modify"
];

/**
 * Obtains parameters from the hash of the URL
 * @return {Object} hashParams - An Object holding the access token of the user.
 * @method getHashParams
 */
export const getHashParams = () => {
    console.log(window.location.hash)
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            let parts = item.split('=')
            initial[parts[0]] = decodeURIComponent(parts[1])

            return initial
        }, {})
}

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`