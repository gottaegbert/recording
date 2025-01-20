import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';

const text = {
  fontSize: 64,
  color: '#4ff0b7',
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
  }, []);
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <Button variant="outline" onClick={handleClick}>
          Number
        </Button>
        <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative">
            <motion.pre style={text}>{rounded}</motion.pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
