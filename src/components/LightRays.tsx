import React, { useMemo, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Canvas, Rect, LinearGradient, Group, vec } from '@shopify/react-native-skia';

interface LightRaysProps {
  visible: boolean;
  rayCount?: number;
  intensity?: number; // 0..1 base opacity
  color?: string; // light color
}

export const LightRays: React.FC<LightRaysProps> = ({
  visible,
  rayCount = 6,
  intensity = 0.3,
  color = '#FFD700',
}) => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [timeMs, setTimeMs] = useState(0);

  const rays = useMemo(() => {
    const arr = Array.from({ length: rayCount }, (_, i) => i);
    return arr.map(i => ({
      width: 0.08 + (i % 2) * 0.04,
      height: 1.8 + (i % 2) * 0.4,
      phase: i * 0.45,
      speed: 0.08 + (i % 3) * 0.04,
      amplitude: 15 + (i % 2) * 8,
      startDelay: i * 1500,
    }));
  }, [rayCount]);

  useEffect(() => {
    let raf = 0;
    let start = Date.now();
    let last = 0;
    const targetDelta = 1000 / 30; // ~30 FPS
    const loop = () => {
      const now = Date.now() - start;
      if (now - last >= targetDelta) {
        setTimeMs(now);
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout;
        if (width && height) setSize({ width, height });
      }}
    >
      {size && (
        <Canvas style={{ position: 'absolute', width: size.width, height: size.height }}>
          {rays.map((r, idx) => {
            const w = r.width * size.width;
            const h = r.height * size.height;
            const t = (timeMs - r.startDelay) / 1000;

            const screenWidth = size.width + w;
            const progress = (t * r.speed) % 1;
            const x = -w + progress * screenWidth;

            const oscillationY = Math.sin(t * r.speed * 2 + r.phase) * r.amplitude;

            const startY = -size.height * 0.3;

            const edgeFade = Math.min(1, Math.min(x + w, screenWidth - x) / (w * 0.5));

            const alpha =
              Math.max(0, Math.min(1, intensity)) *
              edgeFade *
              (0.8 + 0.4 * Math.sin(t * 0.7) + 0.2 * Math.sin(t * 2.1 + r.phase));

            return (
              <Group
                key={`ray-${idx}`}
                transform={[{ translateX: x }, { translateY: startY + oscillationY }] as any}
                opacity={alpha}
              >
                <Rect x={0} y={0} width={w} height={h}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(w, 0)}
                    colors={
                      [`${color}00`, `${color}66`, `${color}AA`, `${color}66`, `${color}00`] as any
                    }
                  />
                </Rect>
              </Group>
            );
          })}
        </Canvas>
      )}
    </View>
  );
};

export default LightRays;
