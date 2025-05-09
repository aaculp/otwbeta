import React, { useRef, useEffect } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import './index.css';

export const Flipr = ({ value }) => {
    const divRef = useRef();

    const tickRef = useRef();

    useEffect(() => {
        const currDiv = divRef.current;

        Tick.DOM.create(currDiv, {
            value,
            didInit: (tick) => {
                tickRef.current = tick;
            },
            view: {
                children: [
                    {
                        repeat: true,
                        root: "div",
                        style: ".flip",
                        transform: "arrive(1, 1, false, true)",
                        transition: "crossfade",
                        children: [
                            {
                                view: "flip"
                            }
                        ]
                    }
                ]
            }
        });

        const tickValue = tickRef.current;
        return () => Tick.DOM.destroy(tickValue);
    }, []);

    useEffect(() => {
        if (tickRef.current) {
            tickRef.current.value = value;
        }
    }, [value]);

    return (
        <div>
            <div ref={divRef} />
        </div>
    )
};

