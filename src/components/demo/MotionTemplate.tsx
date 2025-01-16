import { motion, useAnimate } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const box = {
  width: 100,
  height: 100,
  backgroundColor: '#3354F4',
  borderRadius: 0,
  transformOrigin: 'center center', // 可以是 "left top", "right bottom" 等
};

export default function MotionTemplate() {
  const [scope, animate] = useAnimate();

  const handleClick = async () => {
    await animate(scope.current, {
      rotate: [0, 360],
      transition: { duration: 1 },
    });
  };

  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <Button onClick={handleClick} variant="outline">
          Rotate
        </Button>

        <div className="flex justify-center items-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative">
            <motion.div ref={scope} style={box} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
