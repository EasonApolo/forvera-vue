import styled from 'vue-styled-components'

const Padding = { 0: '.1rem .5rem', 1: '.2rem .625rem' }
const FontSize = { 0: .75, 1: .875}

const Button = styled('button', {
  size: { default: 1 },
  type: { defualt: undefined },
  mr: { default: 1 }
})`
  position: relative;
  display: inline-block;
  margin-right: ${ p => p.mr }rem;
  padding: ${ p => Padding[p.size] }
  font-size: ${ p => `${ FontSize[p.size] }rem`} }
  transition: all .2s ease;
  transition-property: color, background-color;
  cursor: pointer;
  outline: none;
  user-select: none;
  overflow: hidden;
  border-radius: 2rem;
  border: 1px solid ${ p => p.type ? p.theme.btn[p.type] : p.theme.btn.primary };
  background: ${ p => p.theme.bg }
  :hover {
    color: ${ p => p.theme.bg }
    background-color: ${ p => p.type ? p.theme.btn[p.type] : p.theme.btn.primary }
  }
`

const Progress = styled('div', {
  progress: { default: 0 }
})`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 30%;
  width: ${ p => p.progress }%;
  height: 100%;
  background-color: blue;
  transition: all .2s ease;
`

export { Button, Progress }