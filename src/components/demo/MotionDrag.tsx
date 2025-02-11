import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';

const box = {
  width: 540 / 2,
  height: 50,
  backgroundColor: 'var(--main)',
  borderRadius: 0,
};
const constraints = {
  width: 540 / 2,
  height: 50,
  backgroundColor: 'var(--backmain)',
  borderRadius: 2,
  border: '1px solid var(--main)',
  overflow: 'hidden', // 添加这一行
};

export default function DragConstraints() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDrag = () => {
    setPosition((prev) => {
      if (prev.x <= -80) {
        return { x: 0, y: 0 };
      }
      return { x: prev.x - 80, y: prev.y };
    });
  };
  const handleDragEnd = () => {
    setPosition({ x: -80, y: 0 });
  };

  return (
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <Button variant="outline" onClick={handleDrag}>
          Drag
        </Button>
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] items-center justify-center">
          <div className="relative flex flex-col">
            <motion.div ref={constraintsRef} style={constraints}>
              <motion.div
                drag="x"
                dragConstraints={constraintsRef}
                dragElastic={0.5}
                onDragEnd={handleDragEnd} // 添加这一行
                animate={{ x: position.x, y: position.y }}
                transition={{ type: 'ease', ease: [0.36, 0.01, 0.1, 1] }}
                style={box}
              />
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
