// StateSwitcher.tsx
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

import { useTheme } from "next-themes";
import BoundingBox from "../util/BoundingBox";
import Point2D from "../util/Point2D";
import State from "./State";
import StateProperties from "./StateProperties";
import { useEffect, useRef, useState } from "react";

export default function StateSwitcher(
  {
    properties,
    position,
    setPosition,
    setDimensions,
    isSelected,
    addSelection,
    uniqueSelection,
    showContextMenu,
    onDoubleClick = () => {}
  }: {
    properties: StateProperties
    position: Point2D
    setPosition: (newPosition: Point2D) => void
    setDimensions: (position: Point2D, dimensions: Point2D) => void
    isSelected: boolean
    addSelection: () => void
    uniqueSelection: () => void
    showContextMenu: (position: Point2D) => void
    onDoubleClick: () => void
  }
): JSX.Element {
  const windowBox = new BoundingBox(0, 0, window.innerWidth, window.innerHeight)
  const center = position.copy
  center.x += properties.w / 2
  center.y += properties.h / 2
  if (!windowBox.contains(center)) {
    const buffer = 5
    const newPosition = windowBox.normaliseWithin(center, buffer)
    return <HiddenState position={newPosition} name={properties.name} buffer={buffer} />
  } else {
    return <State
      properties={properties}
      position={position}
      setPosition={setPosition}
      setDimensions={setDimensions}
      isSelected={isSelected}
      addSelection={addSelection}
      uniqueSelection={uniqueSelection}
      showContextMenu={showContextMenu}
      onDoubleClick={onDoubleClick}
    />
  }
}

function HiddenState({ position, name, buffer }: {position: Point2D, name: string, buffer: number}): JSX.Element {
    const { resolvedTheme, theme } = useTheme()
    const span = useRef<HTMLSpanElement>(null)
    const [offset, setOffset] = useState(new Point2D(0, 0))
    useEffect(() => {
        const currentSpan = span.current
        if (!currentSpan) {
            setOffset(new Point2D(buffer, buffer))
            return
        }
        const x = position.x > buffer ? -currentSpan.offsetWidth : 0
        const y = position.y > buffer ? -currentSpan.offsetHeight : 0
        setOffset(new Point2D(x, y))
    }, [span.current, setOffset])
    return (
        <div style={{position: 'absolute', left: position.x + offset.x, top: position.y + offset.y}}>
            <span ref={span} className={`cursor-default bg-transparent text-foreground italic`}>{name}</span>
        </div>
    )
}
