function Positionable({position, children}) {
  const positionStyle = {
    left: position.x,
    top: position.y,
    position: 'absolute'
  }
  return (<div style={positionStyle}>{children}</div>);
}

export default Positionable;
