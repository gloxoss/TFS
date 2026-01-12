"use client";

import { useEffect } from "react";
import { company } from "@/data/site-content";

export function ConsoleCredit() {
    useEffect(() => {
        console.log(
            '%c STOP! \n%c This system is the intellectual property of ' + company.fullName + '. \n For maintenance access: ' + company.email,
            'color: red; font-size: 20px; font-weight: bold;',
            'color: white; background: #333; padding: 5px;'
        );
    }, []);
    return null;
}
