import { useEffect, useRef, useState } from "react";
import { defaultItemOverlay } from "../../../scripts/structs/item-data";
import { useArchive } from "./context/useArchive";

const SelectionArea = ({
    resolution,
    display,
    offset,
    imgRef,
} : {
    resolution: { w: number; h: number };
    display: { x: number; y: number; w: number; h: number };
    offset: {
        x: number;
        y: number;
    };
    imgRef: React.RefObject<HTMLImageElement | null>
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const visibleSelectionRef = useRef<HTMLDivElement>(null);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [cursorVisible, setCursorVisible] = useState({ x: 0, y: 0 });
    const [currentPoint, setCurrentPoint] = useState(1);
    const [visible, setVisible] = useState(true);
    const [infoboxToggle, setInfoboxToggle] = useState(false);

    const [visibleArea, setVisibleArea] = useState({ x: 0, y: 0, w: 0, h: 0, });
    const [targetArea, setTargetArea] = useState({ x: 0, y: 0, w: 0, h: 0, });
    const [currentSelection, setCurrentSelection] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, });
    const [selectionRotation, setSelectionRotation] = useState(0);
    const [previewZoom, setPreviewZoom] = useState(1);

    const cursorRef = useRef(cursor);
    const currentPointRef = useRef(currentPoint);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const { setItem } = useArchive();

    useEffect(()=>{
        cursorRef.current = cursor;
        currentPointRef.current = currentPoint
    });

    useEffect(() => {
        let target_x1 = Math.min(currentSelection.x1, currentSelection.x2)
        let target_y1 = Math.min(currentSelection.y1, currentSelection.y2)
        let target_x2 = Math.max(currentSelection.x1, currentSelection.x2)
        let target_y2 = Math.max(currentSelection.y1, currentSelection.y2)

        setTargetArea({
            x: target_x1,
            y: target_y1,
            w: target_x2 - target_x1,
            h: target_y2 - target_y1,
        });

        const scaleX = display.w / resolution.w;
        const scaleY = display.h / resolution.h;

        let x1_scaled = Math.floor(currentSelection.x1 * scaleX + offset.x);
        let x2_scaled = Math.floor(currentSelection.x2 * scaleX + offset.x);
        let y1_scaled = Math.floor(currentSelection.y1 * scaleY + offset.y);
        let y2_scaled = Math.floor(currentSelection.y2 * scaleY + offset.y);

        let visible_x1 = Math.min(x1_scaled, x2_scaled) || 0;
        let visible_x2 = Math.max(x1_scaled, x2_scaled) || 0;
        let visible_y1 = Math.min(y1_scaled, y2_scaled) || 0;
        let visible_y2 = Math.max(y1_scaled, y2_scaled) || 0;

        setVisibleArea({
            x: visible_x1,
            y: visible_y1,
            w: visible_x2 - visible_x1,
            h: visible_y2 - visible_y1,
        });
    }, [currentSelection]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if(!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            const scaleX = resolution.w / display.w ;
            const scaleY = resolution.h / display.h ;

            let x = e.clientX - rect.left - offset.x;
            let y = e.clientY - rect.top - offset.y;

            setCursorVisible({x: x + offset.x,y: y + offset.y});

            x = Math.floor(x * scaleX);
            y = Math.floor(y * scaleY);

            requestAnimationFrame(()=>{
                setCursor({ x, y, });
                if(currentPoint == 2) {
                    setCurrentSelection((prev) => {
                        let new_value = {...prev};

                        new_value.x2 = Math.floor(cursor.x);
                        new_value.y2 = Math.floor(cursor.y);

                        return new_value;
                    });
                }
            })
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [resolution, display, offset, currentSelection]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if(!containerRef.current) return;
            if(e.target !== containerRef.current && e.target !== visibleSelectionRef.current) return;

            const cursor = cursorRef.current;
            const currentPoint = currentPointRef.current;

            if(currentPoint == 1) {
                Reset();
                setCurrentSelection((prev) => {
                    let new_value = {...prev};

                    new_value.x1 = Math.floor(cursor.x);
                    new_value.y1 = Math.floor(cursor.y);

                    return new_value;
                });
            }
            setCurrentPoint(() => currentPoint == 1 ? 2 : 1);
        };

        containerRef.current?.addEventListener("click", handleClick);
        return () => containerRef.current?.removeEventListener("click", handleClick);
    }, [offset])

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            const dy = e.deltaY < 0 ? 1 : -1;
            if(dy == -1 && previewZoom == 1) return; 
            if(dy == 1 && previewZoom == 10) return;

            setPreviewZoom((prev)=>prev + dy);
        }

        containerRef.current?.addEventListener("wheel", handleWheel);
        return () => containerRef.current?.removeEventListener("wheel", handleWheel);
    })

    useEffect(() => {
        if(!canvasRef.current) return;
        if(!imgRef.current) return;
        let canvas = canvasRef.current;
        let ctx = canvas.getContext("2d");

        let image = imgRef.current;

        let rotated = getRotatedImageRegion(image, targetArea.x, targetArea.y, targetArea.w, targetArea.h, selectionRotation);
        if(!rotated) {
            console.log("Error getting rotated region")
            return;
        }
        if(rotated.width == 0) return;

        ctx?.clearRect(0,0, canvas.width, canvas.height);
        ctx?.drawImage(rotated, 0, 0, canvas.width, canvas.height);
    }, [visibleArea, selectionRotation, targetArea, previewZoom]);

    useEffect(() => {
        if(!previewCanvasRef.current) return;
        if(!imgRef.current) return;
        let canvas = previewCanvasRef.current;
        let ctx = canvas.getContext("2d");
        if(!ctx) {
            console.log("Error creating preview ctx");
            return;
        }

        let image = imgRef.current;

        let size = display.w / previewZoom;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, cursor.x-size/2, cursor.y-size/2, size, size, 0,0,canvas.width, canvas.height);

        const ticks = 20;
        ctx.strokeStyle = "#FF0000";
        const tickSize = canvas.height / ticks / 2;
        ctx.beginPath();
        for(let i = 0; i < ticks; i++) {
            let coord1 = canvas.width / ticks * i - tickSize/2;
            let coord2 = canvas.width / ticks * i + tickSize/2;
            ctx.moveTo(canvas.width/2, coord1);
            ctx.lineTo(canvas.width/2, coord2);
            ctx.stroke();
            ctx.moveTo(coord1, canvas.height/2);
            ctx.lineTo(coord2, canvas.height/2);
            ctx.stroke();
        }
        ctx.closePath();
    }, [cursor, previewZoom])

    function getRotatedImageRegion(image: CanvasImageSource, x: number, y: number, width: number, height: number, angle: number) {
        let tempCanvas = document.createElement("canvas");
        let tempCtx = tempCanvas.getContext("2d");
        if(!tempCtx) {
            console.log("Error creating temp ctx");
            return;
        }

        tempCanvas.width = resolution.w;
        tempCanvas.height = resolution.h;

        tempCtx.rotate(-angle * Math.PI / 180);
        tempCtx.translate(-x,-y);
        tempCtx?.drawImage(image, 0, 0);

        if(width == 0 || height == 0) return;

        const resultCanvas = document.createElement("canvas");
        const resultCtx = resultCanvas.getContext("2d");
        if(!resultCtx) {
            console.log("Error creating result ctx");
            return;
        }
        resultCanvas.width = width;
        resultCanvas.height = height;

        resultCtx.drawImage(tempCanvas, 0,0, width, height, 0,0, width, height);

        return resultCanvas;
    }

    function CreateOverlay(id: string = "new_overlay") {
        const input = prompt("Text:");
        if(!input) return;
        setItem((prev) => {
            if (!prev) return prev;

            const getNewId = (baseId: string) => {
                let id = baseId;
                let n = 0;

                while (prev.overlays.some((o) => o.id === id)) {
                    n++;
                    id = `${baseId}_${n}`;
                }

                return id;
            };

            let itemOverlay = defaultItemOverlay(getNewId(id));
            itemOverlay.bounds.x = targetArea.x;
            itemOverlay.bounds.y = targetArea.y;
            itemOverlay.bounds.w = targetArea.w;
            itemOverlay.bounds.h = targetArea.h;
            itemOverlay.rotation = selectionRotation;
            itemOverlay.text = input;

            return {
                ...prev,
                overlays: [
                    ...prev.overlays,
                    itemOverlay,
                ],
            };
        });
        Reset();
    }

    function handleRotationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectionRotation(Number.parseInt(e.target.value));
    }

    function handleXPositionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSelection((prev) => {
            let low: "x1" | "x2" = prev.x1 < prev.x2 ? "x1" : "x2";
            let high: "x1" | "x2" = prev.x1 > prev.x2 ? "x1" : "x2";

            let xl = Number.parseInt(e.target.value);
            let xr = prev[high] + (+e.target.value - prev[low]);

            return {
                ...prev,
                [low]: xl,
                [high]: xr,
            };
        });
    }

    function handleYPositionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSelection((prev) => {
            let low: "y1" | "y2" = prev.y1 < prev.y2 ? "y1" : "y2";
            let high: "y1" | "y2" = prev.y1 > prev.y2 ? "y1" : "y2";

            let yl = Number.parseInt(e.target.value);
            let yr = prev[high] + (+e.target.value - prev[low]);

            return {
                ...prev,
                [low]: yl,
                [high]: yr,
            };
        });
    }

    function handleXSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSelection((prev) => {
            let low: "x1" | "x2" = prev.x1 < prev.x2 ? "x1" : "x2";
            let high: "x1" | "x2" = prev.x1 > prev.x2 ? "x1" : "x2";

            let w = +e.target.value;

            return {
                ...prev,
                [high]: prev[low] + w,
            };
        });
    }

    function handleYSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSelection((prev) => {
            let low: "y1" | "y2" = prev.y1 < prev.y2 ? "y1" : "y2";
            let high: "y1" | "y2" = prev.y1 > prev.y2 ? "y1" : "y2";

            let h = +e.target.value;

            return {
                ...prev,
                [high]: prev[low] + h,
            };
        });
    }

    function Reset() {
        setSelectionRotation(0);
        setCurrentPoint(1);
        setVisibleArea({x:0,y:0,w:0,h:0});
        setTargetArea({x:0,y:0,w:0,h:0});
    }

    return (
        <>
        <div
            ref={containerRef}
            className="absolute w-full h-full top-0 left-0 overflow-hidden select-none"
            style={visible ? {} : {display:"none"}}
        >
            <br/>
            <button
                className="bg-amber-900"
                onClick={() => setInfoboxToggle(s=>!s)}
            >Info: {infoboxToggle ? "ON" : "OFF"}</button>
            <br/>
            <div style={visible ? {} : {display: "none" }}>
                <div
                    ref={visibleSelectionRef}
                    className="absolute border-2 border-amber-800 flex
                    items-center justify-center gap-2 text-sm"
                    style={(() => {
                        return {
                            left: visibleArea.x,
                            top: visibleArea.y,
                            width: visibleArea.w,
                            height: visibleArea.h,
                            transform: `rotate(${selectionRotation}deg)`,
                            transformOrigin: "top left",
                        }
                    })()}
                >
                    <div
                        className="flex gap-2 border-2 border-gray-500 border-double bg-gray-700 p-1 rounded font-bold"
                        style={{
                            display: currentPoint == 2 || (visibleArea.w == 0 && visibleArea.h == 0) ? "none" : "",
                            transform: `rotate(${-selectionRotation}deg)`
                        }}
                    >
                        <button className="bg-cyan-500 px-1 cursor-pointer" onClick={() => CreateOverlay()} > Simple </button>
                        <button className="bg-amber-500 px-1 cursor-pointer" onClick={() => CreateOverlay("title")} > Title </button>
                        <button className="bg-red-500 px-1 cursor-pointer" onClick={Reset} > Cancel </button>
                    </div>
                </div>
                <div
                    id="infoBox"
                    className="absolute pointer-events-none text-sm"
                    style={infoboxToggle ? {} : { display: "none" }}
                >
                    <span className="bg-amber-900">Cursor: X: {cursor.x} Y: {cursor.y}</span>
                    <br/>
                    <span className="bg-amber-900">Area: X: {visibleArea.x} Y: {visibleArea.y} W: {visibleArea.w} H: {visibleArea.h}</span>
                    <br/>
                    <span className="bg-amber-900">Target area: X: {targetArea.x} Y: {targetArea.y} W: {targetArea.w} H: {targetArea.h}</span>
                    <br/>
                    <span className="bg-amber-900">Current point: {currentPoint}</span>
                </div>

                <div
                    className="absolute w-px h-full top-0 border-dashed border-l-2 border-black pointer-events-none"
                    style={{left: cursorVisible.x}}
                ></div>
                <div
                    className="absolute h-px w-full top-0 border-dashed border-t-2 border-black pointer-events-none"
                    style={{top: cursorVisible.y}}
                ></div>
                <div
                    className="flex flex-col absolute bottom-0 border-double border-white border-2 p-4 rounded-2xl"
                >
                    <h2 className="text-center text-lg font-bold">Controls</h2>
                    <span className="font-bold">Position</span>
                    <span className="text-center">X</span>
                    <input
                        type="range"
                        min={-100}
                        max={resolution.w + 100}
                        value={targetArea.x}
                        onChange={handleXPositionChange}
                    />
                    <input
                        type="number"
                        min={-100}
                        max={resolution.w + 100}
                        value={targetArea.x}
                        onChange={handleXPositionChange}
                    />

                    <span className="text-center">Y</span>
                    <input
                        type="range"
                        min={-100}
                        max={resolution.h + 100}
                        value={targetArea.y}
                        onChange={handleYPositionChange}
                    />
                    <input
                        type="number"
                        min={-100}
                        max={resolution.h + 100}
                        value={targetArea.y}
                        onChange={handleYPositionChange}
                    />

                    <span className="font-bold">Size</span>
                    <span className="text-center">Width</span>
                    <input
                        type="range"
                        min={1}
                        max={resolution.w - targetArea.x + 100}
                        value={targetArea.w}
                        onChange={handleXSizeChange}
                    />
                    <input
                        type="number"
                        min={1}
                        max={resolution.w - targetArea.x + 100}
                        value={targetArea.w}
                        onChange={handleXSizeChange}
                    />

                    <span className="text-center">Height</span>
                    <input
                        type="range"
                        min={1}
                        max={resolution.h - targetArea.y + 100}
                        value={targetArea.h}
                        onChange={handleYSizeChange}
                    />
                    <input
                        type="number"
                        min={1}
                        max={resolution.h - targetArea.y + 100}
                        value={targetArea.h}
                        onChange={handleYSizeChange}
                    />

                    <span className="font-bold">Rotation</span>
                    <input
                        type="range"
                        min={-180}
                        max={180}
                        value={selectionRotation}
                        onChange={handleRotationChange}
                    />
                    <input
                        type="number"
                        min={-180}
                        max={180}
                        value={selectionRotation}
                        onChange={handleRotationChange}
                    />
                    <button
                        className="bg-red-500"
                        onClick={Reset}
                    >Reset</button>
                </div>
            </div>
        </div>
        <canvas
            ref={canvasRef}
            width={visibleArea.w * previewZoom}
            height={visibleArea.h * previewZoom}
            className="absolute top-0 right-0 border-2 border-red-600"
        ></canvas>
        <div
        className="absolute bottom-0 right-0"
        >
            <canvas
                ref={previewCanvasRef}
                width={300}
                height={300}
                className="border-2 border-red-600"
            ></canvas>
            <div className="flex items-center justify-center gap-1">
                <input
                    type="range"
                    value={previewZoom}
                    min={1}
                    max={10}
                    step={1}
                    onChange={(e) => setPreviewZoom(Number.parseInt(e.target.value))}
                />
                <span>Zoom: x{previewZoom}</span>
            </div>
        </div>
        <button
            className="absolute top-0 left-0 bg-amber-900"
            onClick={() => setVisible(s=>!s)}
        >Visible: {visible ? "ON" : "OFF"}</button>
        </>
    );
}

export default SelectionArea;
