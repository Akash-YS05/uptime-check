"use client"

import { BACKEND_API_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { useEffect, useState } from "react";

interface Website {
    id: string;
    url: string;
    ticks: {
        id: string;
        status: string;
        createdAt: string;
        latency: number
    }
    // createdAt: string;
    // updatedAt: string;
}

export function useWebsites() {
    const {getToken} = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);

    async function refreshWebsites() {
        const token = getToken();
        const response = await axios.get(`${BACKEND_API_URL}/api/v1/websites`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setWebsites(response.data.websites);
    }

    useEffect(() => {
        refreshWebsites();
        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000*60*1);

        return () => clearInterval(interval)
    }, [])

    return {websites, refreshWebsites};
}