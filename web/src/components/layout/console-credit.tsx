"use client";

import { useEffect } from "react";

export function ConsoleCredit() {
    useEffect(() => {
        console.log(
            '%c TFS %c TV Film Solutions — www.tfs.ma',
            'color: red; font-size: 20px; font-weight: bold;',
            'color: white; background: #333; padding: 5px;'
        );
    }, []);
    return null;
}
