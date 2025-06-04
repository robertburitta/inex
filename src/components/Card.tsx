import { motion, MotionProps } from "framer-motion";
import React from "react";

interface CardProps extends MotionProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  variant?: "basic" | "extended";
}

const Card: React.FC<CardProps> = ({
  icon,
  title,
  value,
  className = "",
  children,
  variant = "basic",
  ...motionProps
}) => {
  if (variant === "extended") {
    // Helpery do bezpiecznego wyciągania children
    const isReactElement = (el: any): el is React.ReactElement =>
      el && typeof el === "object" && "props" in el;
    let mainValue = value;
    let subValue = null;
    if (
      isReactElement(value) &&
      (value as React.ReactElement<any, any>).props &&
      Array.isArray((value as React.ReactElement<any, any>).props.children) &&
      (value as React.ReactElement<any, any>).props.children.length === 2
    ) {
      mainValue = (value as React.ReactElement<any, any>).props.children[0];
      subValue = (value as React.ReactElement<any, any>).props.children[1];
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
        transition={{ duration: 0.3, ...motionProps.transition }}
        className={`bg-white overflow-hidden shadow rounded-lg transition-shadow relative ${className}`}
        {...motionProps}
      >
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-3xl">{icon}</div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subValue}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-2xl font-semibold text-gray-900">{mainValue}</p>
            <div className="flex gap-2">{children}</div>
          </div>
        </div>
      </motion.div>
    );
  }
  // Domyślny wariant (horizontal)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.3, ...motionProps.transition }}
      className={`bg-white overflow-hidden shadow rounded-lg transition-shadow ${className}`}
      {...motionProps}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-3xl">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
        {children && (
          <div className="mt-4 flex items-center justify-between">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
