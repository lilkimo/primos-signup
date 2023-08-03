import {useEffect, useState} from 'react'

import './App.css'
import Form from './components/Form'
import Schedule from './components/Schedule'

import {useStore} from './store'

// MSAL imports
import {MsalProvider} from '@azure/msal-react'
import {useMsal} from '@azure/msal-react'
import {InteractionStatus, InteractionRequiredAuthError} from '@azure/msal-browser'
import {loginRequest} from './authConfig'

import {callMsGraph} from './utils'

function Content() {
  // MSAL start
  const {instance, inProgress} = useMsal()
  const [graphData, setGraphData] = useState(null)

  useEffect(() => {
    if (!graphData && inProgress === InteractionStatus.None) {
      callMsGraph()
        .then(response => setGraphData(response))
        .catch(e => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: instance.getActiveAccount(),
            })
          }
        })
    }
  }, [inProgress, graphData, instance])
  // MSAL end

  const store = useStore()
  
  useEffect(() => {
    store.update_form({ mail: graphData?.mail.split('@') })
  }, [graphData])


  if (graphData)
    return (
      <main className="flex flex-wrap justify-evenly items-stretch min-h-screen bg-black p-24">
        <Form 
          fullname={graphData.displayName}
        />
        {store.phase > 0 &&
          <Schedule />
        }
      </main>
    )
}

const App = ({pca}) => 
  <MsalProvider instance={pca}>
    <Content />
  </MsalProvider>
export default App
