import useSWR, { mutate } from 'swr';

const fetcher = async (url: string, data: any) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
};

export const useUserDB = (user: any) => {
    const shouldFetch = user && !user.isLoading;
    const { data, error } = useSWR(shouldFetch ? ['/api/users', {
        email: user.email,
        sl_id: user.sub,
        username: user.nickname,
        provider: user.sub.split('|')[1],
        imageUrl: user.picture,
    }] : null, fetcher);

    return {
        userData: data,
        isLoading: !error && !data,
        isError: error
    };
};
