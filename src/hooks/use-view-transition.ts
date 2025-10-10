/**
 * useViewTransition Hook
 *
 * 檢測瀏覽器是否支援 View Transitions API
 */

"use client";

import { useEffect, useState } from "react";

export interface UseViewTransitionReturn {
  /**
   * 瀏覽器是否支援 View Transitions API
   */
  isSupported: boolean;
}

/**
 * 檢查瀏覽器是否支援 View Transitions API
 *
 * @returns { isSupported: boolean }
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isSupported } = useViewTransition();
 *
 *   return (
 *     <div>
 *       {isSupported ? (
 *         <p>Your browser supports View Transitions!</p>
 *       ) : (
 *         <p>Your browser does not support View Transitions.</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useViewTransition(): UseViewTransitionReturn {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 檢查 document.startViewTransition 是否存在
    if (typeof document !== "undefined") {
      setIsSupported("startViewTransition" in document);
    }
  }, []);

  return { isSupported };
}
