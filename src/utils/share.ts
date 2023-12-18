export const onShare = async () => {
    const title = 'DiffusionTV'
    const url = window.document.location.href
    const text = 'Discover the Latest AI Gen Videos'

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
