/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginComponent from '../../components/auth/LoginComponent'
import SignupComponent from '../../components/auth/SignupComponent'
import ChatInterface from '../../components/chat/ChatInterface'
import VoiceControls from '../../components/voice/VoiceControls'
import SubscriptionPlans from '../../components/payment/SubscriptionPlans'

// Mock the framer-motion components since they're not important for these tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    form: ({ children, ...props }) => <form {...props}>{children}</form>
  },
  AnimatePresence: ({ children }) => <>{children}</>
}))

describe('LoginComponent', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginComponent onLogin={() => {}} onGoogleLogin={() => {}} onSignUp={() => {}} />)
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('calls onLogin when form is submitted', () => {
    const mockLogin = vi.fn()
    const mockGoogleLogin = vi.fn()
    const mockSignUp = vi.fn()
    
    render(<LoginComponent onLogin={mockLogin} onGoogleLogin={mockGoogleLogin} onSignUp={mockSignUp} />)
    
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('calls onSignUp when sign up link is clicked', () => {
    const mockLogin = vi.fn()
    const mockGoogleLogin = vi.fn()
    const mockSignUp = vi.fn()
    
    render(<LoginComponent onLogin={mockLogin} onGoogleLogin={mockGoogleLogin} onSignUp={mockSignUp} />)
    
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    fireEvent.click(signUpButton)
    
    expect(mockSignUp).toHaveBeenCalled()
  })
})

describe('SignupComponent', () => {
  it('renders signup form with email and password fields', () => {
    render(<SignupComponent onSignup={() => {}} onLogin={() => {}} />)
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('calls onSignup when form is submitted', () => {
    const mockSignup = vi.fn()
    const mockLogin = vi.fn()
    
    render(<SignupComponent onSignup={mockSignup} onLogin={mockLogin} />)
    
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('calls onLogin when login link is clicked', () => {
    const mockSignup = vi.fn()
    const mockLogin = vi.fn()
    
    render(<SignupComponent onSignup={mockSignup} onLogin={mockLogin} />)
    
    const loginButton = screen.getByRole('button', { name: 'Sign in' })
    fireEvent.click(loginButton)
    
    expect(mockLogin).toHaveBeenCalled()
  })
})

describe('ChatInterface', () => {
  it('renders chat interface with message input', () => {
    const messages = [{ role: 'assistant', content: 'Hello!' }]
    render(<ChatInterface messages={messages} onSendMessage={() => {}} isLoading={false} />)
    
    expect(screen.getByPlaceholderText('Share your thoughts with Serene...')).toBeInTheDocument()
    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })
})

describe('VoiceControls', () => {
  it('renders voice controls with toggle switch', () => {
    const voiceSettings = { voiceId: 'female-1', speed: 1.0 }
    render(
      <VoiceControls 
        isVoiceEnabled={false} 
        onToggleVoice={() => {}} 
        voiceSettings={voiceSettings} 
        onVoiceSettingsChange={() => {}} 
      />
    )
    
    expect(screen.getByText('Voice Settings')).toBeInTheDocument()
    expect(screen.getByText('Voice Responses')).toBeInTheDocument()
  })
})

describe('SubscriptionPlans', () => {
  it('renders subscription plans with pricing options', () => {
    render(<SubscriptionPlans onSelectPlan={() => {}} />)
    
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })
})