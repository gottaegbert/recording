import { motion, stagger, useAnimate } from "motion/react"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const box = {
    width: 540/2,
    height: 125/2,
    backgroundColor: "#00ffdb",
    borderRadius: 0,
    margin: 1,
    transformOrigin: "center center" 
}

export default function Motion1() {
    const [scope, animate] = useAnimate()
    
    const handleClick = async () => {
        // 重置所有元素
        await animate(scope.current, { x: -150, y:0, opacity: 0 }, { duration: 0 })
        // 依次执行进入动画
        await animate(scope.current, 
            { x: 0, opacity: 1 },
            { 
                duration: 0.15,
                delay: stagger(0.1),
                
                    ease: [0.36, 0.01, 0.1, 1] // 添加 easing
         
                
            }
        )
    }
    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent className="p-6">
                <Button 
                    onClick={handleClick}
                    variant="outline"
                >
                    Insert File
                </Button>
                <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
                    <div className="flex flex-col">
                        <motion.div ref={scope} style={box} />
                        <motion.div style={box}  initial={{ y: -50, opacity: 0 }} // 初始位置
                            animate={{ y: 0, opacity: 1 }}/>
                        <motion.div  style={box} />
                        <motion.div style={box} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
