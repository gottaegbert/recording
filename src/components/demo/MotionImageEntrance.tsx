import { motion } from 'framer-motion';
import { CardContent } from '../ui/card';
import { Card } from '../ui/card';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function MotionImageEntrance() {
  const [boxCount, setBoxCount] = useState(8);
  const [randomRotation, setRandomRotation] = useState(0); // 改为单个角度值

  const radius = 200; // 圆的半径
  const boxSize = 100; // 方块大小
  // 随机改变方块数量（4-12个之间）
  const randomizeCount = () => {
    const newCount = Math.floor(Math.random() * 20) + 4; // 4到12之间的随机数
    setBoxCount(newCount);
    // 重置随机角度数组
    setRandomRotation(0);
  };

  // 每个方块的角度
  const randomizeRotation = () => {
    const newRotation = Math.floor(Math.random() * 9); // 4到12之间的随机数
    setRandomRotation(newRotation);
  };

  // 计算每个方块的位置
  const boxes = Array.from({ length: boxCount }).map((_, index) => {
    const angle = (index * 2 * Math.PI) / boxCount;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  });

  return (
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <Button variant="outline" onClick={randomizeCount}>
          Random Rect Number
        </Button>
        <Button variant="outline" onClick={randomizeRotation}>
          Random Rect Angle
        </Button>
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] flex-col items-center justify-center">
          <div className="relative flex flex-col">
            <motion.div
              style={{
                position: 'relative',
                width: radius * 2.5,
                height: radius * 2.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {boxes.map((position, index) => (
                <motion.div
                  key={index}
                  style={{
                    position: 'absolute',
                    width: boxSize,
                    height: boxSize / 3,
                    backgroundColor: 'var(--main)',
                    borderRadius: 2,
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    x: position.x,
                    y: position.y,
                    opacity: 1,
                    rotate: (index + randomRotation) * (360 / boxCount), //这个调整每个方块角度
                  }}
                  transition={{
                    delay: index * 0.15,
                    duration: 1,
                    ease: 'easeOut',
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
