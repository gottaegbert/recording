import { motion, useAnimate } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const boxnew = {
  width: 540 / 2,
  height: 100 / 2,
  backgroundColor: 'var(--main)',
  borderRadius: 0,
  margin: 1,
  transformOrigin: 'center center',
};
const box = {
  width: 540 / 2,
  height: 100 / 2,
  backgroundColor: '#00ffdb',
  borderRadius: 0,
  margin: 1,
  transformOrigin: 'center center',
};

export default function MotionStagger() {
  const [scope, animate] = useAnimate();
  const [scope2, animateY] = useAnimate();

  const handleClick = async () => {
    // 重置所有元素
    await animate(
      scope.current,
      { x: -150, y: 0, opacity: 0 },
      { duration: 0 },
    );
    // 依次执行进入动画
    await animateY(
      scope2.current,
      { y: 0, opacity: 1 },
      {
        duration: 0.15,
        ease: [0.36, 0.01, 0.1, 1], // 添加 easing
      },
    );
    await animate(
      scope.current,
      { x: 0, opacity: 1 },
      {
        duration: 0.15,
        ease: [0.36, 0.01, 0.1, 1], // 添加 easing
      },
    );
  };
  return (
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <Button onClick={handleClick} variant="outline" size="sm">
          Insert File
        </Button>
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] items-center justify-center">
          <div className="flex flex-col">
            <motion.div
              ref={scope}
              style={boxnew}
              initial={{ opacity: 0 }} // 初始位置
              animate={{ opacity: 0 }}
            />
            <motion.div
              ref={scope2}
              style={box}
              initial={{ y: -100, opacity: 0 }} // 初始位置
              animate={{ y: -50, opacity: 1 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
