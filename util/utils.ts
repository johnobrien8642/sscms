export function blogPostSearch(search: string) {
    return {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { subHeading: { $regex: search, $options: 'i' } },
            { author: { $regex: search, $options: 'i' } },
            { richDescription: { $regex: search, $options: 'i' } }
        ]
    }
}