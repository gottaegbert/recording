import { motion, useAnimate } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const box = {
  width: 100,
  height: 100,
  backgroundColor: 'var(--main)',
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
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <Button onClick={handleClick} variant="outline">
          Rotate
        </Button>

        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] items-center justify-center">
          <div className="relative flex flex-col">
            <motion.div ref={scope} style={box} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
