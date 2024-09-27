// transitions.tsx
// editor
// 
// Created by Morgan McColl.
// Copyright © 2024 Morgan McColl. All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// 
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 
// 2. Redistributions in binary form must reproduce the above
//    copyright notice, this list of conditions and the following
//    disclaimer in the documentation and/or other materials
//    provided with the distribution.
// 
// 3. All advertising materials mentioning features or use of this
//    software must display the following acknowledgement:
// 
//    This product includes software developed by Morgan McColl.
// 
// 4. Neither the name of the author nor the names of contributors
//    may be used to endorse or promote products derived from this
//    software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
// OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// 
// -----------------------------------------------------------------------
// This program is free software; you can redistribute it and/or
// modify it under the above terms or under the terms of the GNU
// General Public License as published by the Free Software Foundation;
// either version 2 of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program; if not, see http://www.gnu.org/licenses/
// or write to the Free Software Foundation, Inc., 51 Franklin Street,
// Fifth Floor, Boston, MA  02110-1301, USA.

import { useEffect, useRef } from "react";
import TransitionProperties from "./TransitionProperties";
import { useTheme } from "next-themes";


export default function Transitions({
    transitions,
    priorities,
    focusedObjects,
    width,
    height
  }: {
    transitions: { [id: string]: TransitionProperties }
    priorities: { [id: string]: number }
    focusedObjects: Set<string>
    width: number
    height: number
  }): JSX.Element {
    const { resolvedTheme, theme } = useTheme()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const defaultColor = (resolvedTheme ?? theme) == 'dark' ? 'white' : 'black';
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) {
        console.log("Canvas is null!")
        return
      }
      const context = canvas.getContext("2d")
      // clear canvas.
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 1
      Object.keys(transitions).forEach((id) => {
        const transition = transitions[id]
        if (!transition) {
          console.log("Transition is null!")
          return
        }
        const path = transition.path
        const color = focusedObjects.has(id) ? 'rgb(58, 58, 228)' : defaultColor
        // Transitions Line.
        context.beginPath()
        context.moveTo(path.source.x, path.source.y)
        context.bezierCurveTo(
          path.control0.x, path.control0.y, path.control1.x, path.control1.y, path.target.x, path.target.y
        )
        context.strokeStyle = color
        context.stroke()

        // Arrow Tip.
        const pointNearEnd = getCubicBezierXYatT(
          {x: path.source.x, y: path.source.y},
          {x: path.control0.x, y: path.control0.y},
          {x: path.control1.x, y: path.control1.y},
          {x: path.target.x, y: path.target.y},
          0.99
        )
        const dx = path.target.x - pointNearEnd.x;
        const dy = path.target.y - pointNearEnd.y;
        const endingAngle = Math.atan2(dy,dx);
        const size = context.lineWidth * 2.5
        context.fillStyle = color
        context.beginPath()
        context.save()
        context.translate(path.target.x, path.target.y)
        context.rotate(endingAngle)
        context.moveTo(0, 0)
        context.lineTo(-size * 3, -size * 2)
        context.lineTo(-size * 2, 0)
        context.lineTo(-size * 3, size * 2)
        context.lineTo(0, 0)
        context.closePath()
        context.fill()
        context.restore()

        // Strokes.
        const priority = priorities[id]
        if (!priority) {
          console.log("No priority!")
          return
        }
        if (priority <= 0) return
        console.log("Priority: " + priority)
        const dS = 0.025
        const strokeSize = 4
        for (let i = 1; i <= priority; i++) {
          const pointNearStart = getCubicBezierXYatT(
            {x: path.source.x, y: path.source.y},
            {x: path.control0.x, y: path.control0.y},
            {x: path.control1.x, y: path.control1.y},
            {x: path.target.x, y: path.target.y},
            dS * i
          )
          const dx = pointNearStart.x - path.source.x
          const dy = pointNearStart.y - path.source.y
          const startAngle = Math.atan2(dy,dx);
          console.log("Start point: " + pointNearStart.x + ", " + pointNearStart.y)
          console.log("Start Angle: " + startAngle)
          context.beginPath()
          context.save()
          context.translate(pointNearStart.x, pointNearStart.y)
          context.rotate(startAngle)
          context.moveTo(0, 0)
          context.lineTo(0, strokeSize + strokeSize * 0.5 * (i - 1))
          context.moveTo(0, 0)
          context.lineTo(0, -strokeSize - strokeSize * 0.5 * (i - 1))
          context.stroke()
          context.restore()
        }
      })
    }, [canvasRef, canvasRef.current, transitions, focusedObjects, defaultColor, priorities])
    return (<canvas width={width} height={height} ref={canvasRef}></canvas>)
}

function getCubicBezierXYatT(startPt,controlPt1,controlPt2,endPt,T){
  var x=CubicN(T,startPt.x,controlPt1.x,controlPt2.x,endPt.x);
  var y=CubicN(T,startPt.y,controlPt1.y,controlPt2.y,endPt.y);
  return({x:x,y:y});
}

// cubic helper formula at T distance
function CubicN(T, a,b,c,d) {
  var t2 = T * T;
  var t3 = t2 * T;
  return a + (-a * 3 + T * (3 * a - a * T)) * T
  + (3 * b + T * (-6 * b + b * 3 * T)) * T
  + (c * 3 - c * 3 * T) * t2
  + d * t3;
}
