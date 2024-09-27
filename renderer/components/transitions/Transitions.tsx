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
import BezierPath from "../util/BezierPath";
import Point2D from "../util/Point2D";
import Transition from "./Transition";
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
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.lineWidth = 1
      Object.keys(transitions).forEach((id) => {
        const transition = transitions[id]
        if (!transition) {
          console.log("Transition is null!")
          return
        }
        const path = transition.path
        context.beginPath()
        context.moveTo(path.source.x, path.source.y)
        console.log(
          "Creating bezier curve from", path.source, "to", path.target, "with control points", path.control0, "and", path.control1
        )
        context.bezierCurveTo(
          path.control0.x, path.control0.y, path.control1.x, path.control1.y, path.target.x, path.target.y
        )
        context.strokeStyle = focusedObjects.has(id) ? 'rgb(58, 58, 228)' : defaultColor
        context.stroke()
        
      })
    }, [canvasRef, canvasRef.current, transitions, focusedObjects, defaultColor, priorities])
    return (<canvas width={width} height={height} ref={canvasRef}></canvas>)
}
