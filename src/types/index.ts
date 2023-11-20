export interface RawResult {
    id: number;
    category: number;
    videoId: string;
    remoteId: string;
    likeCount: number;
    heartCount: number;
    commentCount: number;
    username: string;
    meta: string;
    user_imageUrl: string;
    user_id: string;
    liked: number;
    bookmarked: number;
}
export interface Storage {
    videoUrl: string;
}

export interface Data {
    dbData: RawResult;
    storage: Storage;
}

export interface FeedVideoList {
    data: Data;
}