import React, { useRef, useEffect, useState } from "react";

const InfiniteList = ({className, children, next, loading, hasMore}) => {
    const bufferSpace = 700;
    const [isNextRequested, setIsNextRequested] = useState(false)
    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + bufferSpace;
        if (bottom && hasMore) { 
            if (!isNextRequested) {
              setIsNextRequested(true)
              next();
            }
        }
    }

    useEffect(() => {
      setIsNextRequested(false)
    }, [children])
  
    return (
      <div onScroll={handleScroll} style={{ overflowY: 'scroll', maxHeight: '1000px' }} className={className}>
        {children}
        {loading && <p> Loading ... </p>}
      </div>
      
    );
  };
  
  export default InfiniteList;