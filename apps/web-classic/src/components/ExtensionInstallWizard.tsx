/**
 * Extension Installation Wizard Component
 * Guides users through Chrome extension installation
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Chrome, Download, Settings } from 'lucide-react'

interface ExtensionWizardProps {
    isOpen: boolean
    onClose: () => void
    onComplete: () => void
}

export const ExtensionInstallWizard: React.FC<ExtensionWizardProps> = ({
    isOpen,
    onClose,
    onComplete
}) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const steps = [
        {
            title: 'Términos y Condiciones',
            description: 'Lee y acepta para continuar',
            action: 'terms'
        },
        {
            title: 'Descargar Extensión',
            description: 'Descarga el archivo de la extensión',
            action: 'download'
        },
        {
            title: 'Abrir Chrome Extensions',
            description: 'Ve a chrome://extensions/',
            action: 'navigate'
        },
        {
            title: 'Activar Modo Desarrollador',
            description: 'Activa el interruptor arriba a la derecha',
            action: 'enable-dev'
        },
        {
            title: 'Cargar Extensión',
            description: 'Arrastra el archivo descargado',
            action: 'install'
        },
        {
            title: '¡Listo!',
            description: 'La extensión está instalada',
            action: 'complete'
        }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            onComplete()
            onClose()
        }
    }

    const handleDownload = () => {
        // Download the extension zip file
        const link = document.createElement('a')
        link.href = '/downloads/son1kverse-extension.zip'
        link.download = 'son1kverse-extension.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Auto-advance after short delay
        setTimeout(() => handleNext(), 1000)
    }

    const handleOpenExtensions = () => {
        // This won't work due to Chrome security, but we can copy to clipboard
        navigator.clipboard.writeText('chrome://extensions/')
        alert('URL copiada al portapapeles. Pégala en la barra de direcciones de Chrome.')
        handleNext()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#1C232E] border border-white/10 rounded-2xl max-w-2xl w-full p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Progress indicator */}
                    <div className="flex justify-between mb-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-1 mx-1 rounded ${index <= currentStep ? 'bg-[#40FDAE]' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Step content */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStep === steps.length - 1 ? 'bg-green-500/20' : 'bg-[#40FDAE]/20'
                                }`}>
                                {currentStep === steps.length - 1 ? (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : (
                                    <Chrome className="w-6 h-6 text-[#40FDAE]" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-white/60">Paso {currentStep + 1} de {steps.length}</p>
                                <h3 className="text-2xl font-bold text-white">{steps[currentStep].title}</h3>
                            </div>
                        </div>

                        <p className="text-white/80 text-lg mb-6">{steps[currentStep].description}</p>

                        {/* Step-specific content */}
                        {steps[currentStep].action === 'terms' && (
                            <div className="bg-[#171925] rounded-xl p-6 max-h-64 overflow-y-auto mb-4">
                                <h4 className="text-lg font-semibold mb-3 text-white">Términos y Condiciones - Son1kVerse</h4>
                                <div className="text-white/70 text-sm space-y-2">
                                    <p>Al usar la extensión Son1kVerse AI Music Engine, aceptas:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>La extensión captura tokens de autenticación de forma segura</li>
                                        <li>Los tokens se usan exclusivamente para generación de música</li>
                                        <li>No compartimos tus datos con terceros</li>
                                        <li>Puedes desinstalar la extensión en cualquier momento</li>
                                        <li>El servicio se proporciona "tal cual" sin garantías</li>
                                    </ul>
                                    <p className="mt-4">Última actualización: Noviembre 2024</p>
                                </div>
                                <label className="flex items-center gap-2 mt-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-transparent"
                                    />
                                    <span className="text-white/80">He leído y acepto los términos y condiciones</span>
                                </label>
                            </div>
                        )}

                        {steps[currentStep].action === 'download' && (
                            <div className="bg-[#171925] rounded-xl p-6 border border-[#40FDAE]/20">
                                <Download className="w-12 h-12 text-[#40FDAE] mb-4" />
                                <p className="text-white/80 mb-4">
                                    Descarga el archivo de la extensión. Se guardará en tu carpeta de Descargas.
                                </p>
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-gradient-to-r from-[#40FDAE] to-[#15A4A2] text-[#171925] font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
                                >
                                    Descargar Extensión
                                </button>
                            </div>
                        )}

                        {steps[currentStep].action === 'navigate' && (
                            <div className="bg-[#171925] rounded-xl p-6 border border-[#40FDAE]/20">
                                <Settings className="w-12 h-12 text-[#40FDAE] mb-4" />
                                <p className="text-white/80 mb-4">
                                    Abre una nueva pestaña en Chrome y pega esta URL en la barra de direcciones:
                                </p>
                                <div className="bg-black/40 rounded-lg p-3 mb-4 font-mono text-[#40FDAE] flex items-center justify-between">
                                    <code>chrome://extensions/</code>
                                    <button
                                        onClick={handleOpenExtensions}
                                        className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors"
                                    >
                                        Copiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {steps[currentStep].action === 'enable-dev' && (
                            <div className="bg-[#171925] rounded-xl p-6">
                                <p className="text-white/80 mb-4">
                                    En la página de extensiones, busca el interruptor "Modo de desarrollador" en la esquina superior derecha y actívalo.
                                </p>
                                <img
                                    src="/extension-wizard/dev-mode.png"
                                    alt="Developer mode"
                                    className="rounded-lg border border-white/10"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            </div>
                        )}

                        {steps[currentStep].action === 'install' && (
                            <div className="bg-[#171925] rounded-xl p-6">
                                <p className="text-white/80 mb-4">
                                    1. Haz clic en "Cargar extensión sin empaquetar"<br />
                                    2. Selecciona la carpeta que descargaste<br />
                                    3. ¡Listo! La extensión se instalará automáticamente
                                </p>
                            </div>
                        )}

                        {steps[currentStep].action === 'complete' && (
                            <div className="bg-gradient-to-r from-green-500/10 to-[#40FDAE]/10 rounded-xl p-6 border border-green-500/20">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
                                <p className="text-white text-center text-lg">
                                    ¡La extensión está instalada correctamente! Ya puedes generar música sin límites.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-4">
                        {currentStep > 0 && currentStep < steps.length - 1 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="flex-1 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
                            >
                                Anterior
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={currentStep === 0 && !agreedToTerms}
                            className="flex-1 py-3 bg-gradient-to-r from-[#40FDAE] to-[#15A4A2] text-[#171925] font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentStep === steps.length - 1 ? 'Finalizar' :
                                currentStep === 1 ? 'Ya descargué' :
                                    'Siguiente'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
