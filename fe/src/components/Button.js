import styled from 'vue-styled-components'

const Button = styled('button', {
  size: { default: 1 },
  type: { defualt: undefined },
})`
  display: inline-block;
  margin-right: 1rem;
  padding: ${ p => p.size ? '.2rem 1rem' : '.1rem .75rem'}
  font-size: ${ p => `${ p.size ? .875 : .75 }rem`} }
  transition: all .2s ease;
  transition-property: color, background-color;
  cursor: pointer;
  outline: none;
  user-select: none;
  border-radius: 2rem;
  border: 1px solid ${ p => p.type ? p.theme.btn[p.type] : p.theme.btn.primary };
  background: ${ p => p.theme.bg }
  :hover {
    color: ${ p => p.theme.bg }
    background-color: ${ p => p.type ? p.theme.btn[p.type] : p.theme.btn.primary }
  }
`

export { Button }