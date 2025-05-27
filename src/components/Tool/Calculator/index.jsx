import React, { useState } from 'react';

const Calculator = () => {
    const [display, setDisplay] = useState('');

    // Adiciona dígito ou operador ao display
    const handleClick = (value) => {
        setDisplay(display + value);
    };

    // Limpa o display
    const handleClear = () => {
        setDisplay('');
    };

    // Calcula o resultado
    const handleCalculate = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(display);
            setDisplay(result.toString());
        } catch (error) {
            setDisplay('Erro');
        }
    };

    return (
        <div className="shadow mt-3">
            <div className="row justify-content-center w-auto">
                <div className="col-md-12">
                    <div className="card bg-secondary rounded">
                        <div className="card-body">
                            {/* Display */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    value={display}
                                    readOnly
                                />
                            </div>

                            {/* Botões */}
                            <div className="row g-2">
                                {/* Primeira linha */}
                                <div className="col-3">
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() => handleClear()}
                                    >
                                        C
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() => handleClick('(')}
                                    >
                                        (
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() => handleClick(')')}
                                    >
                                        )
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={() => handleClick('/')}
                                    >
                                        ÷
                                    </button>
                                </div>

                                {/* Segunda linha */}
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('7')}
                                    >
                                        7
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('8')}
                                    >
                                        8
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('9')}
                                    >
                                        9
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={() => handleClick('*')}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Terceira linha */}
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('4')}
                                    >
                                        4
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('5')}
                                    >
                                        5
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('6')}
                                    >
                                        6
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={() => handleClick('-')}
                                    >
                                        -
                                    </button>
                                </div>

                                {/* Quarta linha */}
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('1')}
                                    >
                                        1
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('2')}
                                    >
                                        2
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('3')}
                                    >
                                        3
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={() => handleClick('+')}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Quinta linha */}
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('0')}
                                    >
                                        0
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        className="btn btn-light w-100"
                                        onClick={() => handleClick('.')}
                                    >
                                        .
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button
                                        className="btn btn-info w-100"
                                        onClick={() => handleCalculate()}
                                    >
                                        =
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;