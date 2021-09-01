import styled from 'styled-components'
import { 
  Account,
  Wallet 
} from '@archetypes'

const _Wallet = styled(
  ({
    className
  }) => 
    <section 
      className={className}
      >
      <header>
        <Wallet.Total/>
        <Account.Button/>
      </header>
      <Wallet.Assets/>
      <Wallet.Crowdloans/>
      <Wallet.Staking/>
    </section>
  )
  `
    margin: 0 auto;
    width: 100%;
    max-width: calc(92rem + 6vw);
    padding: 0 3vw;
    margin: 6rem auto;

    >*{
      margin-bottom: 3.25vw
    }

    >header{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    
  `

export default _Wallet