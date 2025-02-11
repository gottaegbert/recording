import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';

const text = {
  fontSize: 64,
  color: 'var(--ball)',
};

export default function MotionNumber() {
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));
  const handleClick = () => {
    count.set(0); // 重置数值到0
    animate(count, 100, { duration: 10 }); // 重新开始动画
  };

  useEffect(() => {
    const controls = animate(count, 100, { duration: 10 });
    return () => controls.stop();
  }, [count]);
  return (
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <Button variant="outline" onClick={handleClick}>
          Number
        </Button>
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] items-center justify-center">
          <div className="relative flex flex-col">
            <motion.pre style={text}>{rounded}</motion.pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
