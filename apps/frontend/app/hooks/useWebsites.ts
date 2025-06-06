"use client"

import { BACKEND_API_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Website {
    id: string;
    url: string;
    disabled: boolean;
    ticks: {
        id: string;
        status: string;
        createdAt: string;
        latency: number;
    }[];
    // createdAt: string;
    // updatedAt: string;
}

export function useWebsites() {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshWebsites = useCallback(async () => {
        try {
            setError(null);
            const token = await getToken(); 
    
            if (!token) {
                throw new Error('No authentication token available');
            }
    
            const response = await axios.get(`${BACKEND_API_URL}/api/v1/websites`, {
                headers: {
                    Authorization: token
                }
            });

            const enabledWebsites = response.data.websites.filter(
                (website: Website) => !website.disabled
            )
    
            setWebsites(enabledWebsites);
        } catch (err) {
            console.error('Error fetching websites:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch websites');
        } finally {
            setLoading(false);
        }
    }, [getToken]);
    

    useEffect(() => {
        refreshWebsites();
        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1);
    
        return () => clearInterval(interval);
    }, [refreshWebsites]);
    

    return { websites, refreshWebsites, loading, error };
}