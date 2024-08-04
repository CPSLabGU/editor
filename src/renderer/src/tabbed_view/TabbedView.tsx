// TabbedView.tsx
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

import TabBarView from './TabBarView'
import ViewData from './ViewData'

interface TabbedViewArgs {
  views: { [id: string]: { [viewType: string]: ViewData | undefined } }
  focusedView: { id: string; viewType: string } | undefined
  setViews: (newViews: { [id: string]: { [viewType: string]: ViewData | undefined } }) => void
  setFocus: (id: string, viewType: string) => void
}

export default function TabbedView({
  views,
  focusedView,
  setViews,
  setFocus
}: TabbedViewArgs): JSX.Element {
  if (Object.keys(views).length == 0) {
    return <div>Empty Views!</div>
  }
  if (!focusedView) return <div>Empty Views!</div>
  const focusedID = focusedView.id
  const focusedViewType = focusedView.viewType
  const openViews: { [id: string]: [string] } = {}
  for (const id in views) {
    const view = views[id]
    for (const subViewType in view) {
      if (view[subViewType]) {
        const currentOpenViews = openViews[id] ?? []
        currentOpenViews.push(subViewType)
        openViews[id] = currentOpenViews
      }
    }
  }
  let count = 0
  for (const id in openViews) {
    count += openViews[id].length ?? 0
  }
  if (count == 1) {
    const id = Object.keys(openViews)[0]
    const viewType = Object.keys(openViews[id])[0]
    return openViews[id][viewType]
  }
  const focusedViewElement = views[focusedID][focusedViewType]?.view
  let element: JSX.Element | undefined = undefined
  if (focusedViewElement) {
    element = focusedViewElement
  } else {
    const id = Object.keys(openViews)[0]
    const viewType = Object.keys(openViews[id])[0]
    element = views[id][viewType]?.view
  }
  return (
    <div>
      <div className="nav-bar">
        <TabBarView
          views={views}
          focusedView={focusedView}
          setViews={setViews}
          setFocus={setFocus}
        />
      </div>
      <div className="page-container">{element}</div>
    </div>
  )
}
