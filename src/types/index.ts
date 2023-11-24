export interface RawResult {
    id: number;
    category: number;
    videoId: string;
    remoteId: string;
    likeCount: number;
    width: number;
    height: number;
    heartCount: number;
    commentCount: number;
    username: string;
    meta: string;
    user_imageUrl: string;
    user_id: string;
    likeHeartEngageCount: number;
    bookmarkCount: number
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
