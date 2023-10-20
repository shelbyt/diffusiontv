export const onShare = async () => {
    const title = 'FlowTok by FlowMe'
    const url = window.document.location.href
    const text = 'The AiGen Social Platform'

    if (navigator.share) {
        try {
            await navigator.share({
                title,
                url,
                text,
            })
        } catch (err) {
            console.warn(err)
        }
    } else {
        alert('Use this application on a mobile')
    }
}
