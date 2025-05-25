"use client"

import { BACKEND_API_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Website {
    id: string;
    url: string;
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

    async function refreshWebsites() {
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

            setWebsites(response.data.websites);
        } catch (err) {
            console.error('Error fetching websites:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch websites');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshWebsites();
        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1);

        return () => clearInterval(interval);
    }, []);

    return { websites, refreshWebsites, loading, error };
}