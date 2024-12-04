import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it } from 'vitest'
import { HogakPlayer } from '.'

describe('HogakPlayer test:', () => {
  afterEach(cleanup)

  it('should render component', () => {
    render(<HogakPlayer url='' />)
  })

  it('should render title', () => {
    render(<HogakPlayer url='' title='Title Test' />)
    screen.getByText('Title Test')
  })
})
