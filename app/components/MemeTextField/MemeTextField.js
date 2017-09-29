import _ from 'lodash';
import React, {Component} from 'react'

// constants
import constants from './constants'
import buttons from './buttons';
import colors from 'constants/colors';

// helpers
import helpers from 'helpers/helpers';

// components
import MemeTextFieldButton from 'components/MemeTextFieldButton/MemeTextFieldButton';

const getSharedStyles =  (canvas, position, initialFontSize) => {
    return {
        width: (canvas.width * 0.975),
        left: (canvas.width) / 100,
        fontSize: initialFontSize,
        top: helpers.getTextPosition(position, canvas, initialFontSize),
        lineHeight: 1.3
    };
}

export default class MemeTextField extends Component {

    constructor(props) {
        super(props);
        const { canvas, position } = props;
        const initialFontSize = (canvas.width / 10);

       const sharedStyles = getSharedStyles(canvas, position, initialFontSize);

        const strokeStyle = {
            ...constants.strokeStyle,
            ...sharedStyles,
            strokeWidth: (parseInt(constants.strokeStyle.fontSize) / 6)
        };

        const fillStyle = {
            ...constants.fillStyle,
            ...sharedStyles
        };

        this.state = {

            textValue: '',

            fillStyle: fillStyle,
            strokeStyle: strokeStyle,

            fillTextBox: new fabric.Textbox("", {...fillStyle}),

            strokeTextBox: new fabric.Textbox("", {...strokeStyle})
        }

    }

    componentDidMount() {
        const shouldStyleTextToDankFormat = (this.props.format === 'dankFormat' && this.props.position === 'top');

        if (shouldStyleTextToDankFormat) {
            this.handleAction('toggleTextColor');
            setTimeout(() => this.handleAction('makeFontLight'), 200);
            setTimeout(() =>  this.styleBothLayers({textAlign: 'right'}), 500)
        }
    }

    componentWillUnmount(){
        this.props.canvas.remove(this.state.fillTextBox);
        this.props.canvas.remove(this.state.strokeTextBox);
        this.setState({ textValue : ''});
    }

    onInputChange = ({ target: { value } }) => {
        this.setState({textValue: value})
        const { fillTextBox, strokeTextBox, alreadyOnCanvas } = this.state;
        const  { canvas } = this.props
        if (!alreadyOnCanvas) {
            this.addTextToCanvas(value)
            this.bindTextBoxEvents()
            this.setStrokeLayerPos(fillTextBox, strokeTextBox)
        }
        strokeTextBox.setText(value)
        strokeTextBox.bringForward()
        fillTextBox.setText(value)
        fillTextBox.bringToFront()
        canvas.renderAll()
    }


    addTextToCanvas = () => {
        const { canvas } = this.props
        const { strokeTextBox, fillTextBox } = this.state
        this.setState({ alreadyOnCanvas : true })
        canvas.add(strokeTextBox)
        canvas.add(fillTextBox)
    }

    bindTextBoxEvents = () => {

        const { fillTextBox, strokeTextBox } = this.state;

        //on move
        fillTextBox.on('moving', function () {
            strokeTextBox.top = fillTextBox.top - (strokeTextBox.strokeWidth / 2 * fillTextBox.scaleX)
            strokeTextBox.left = fillTextBox.left - (strokeTextBox.strokeWidth / 2 * fillTextBox.scaleY)
            strokeTextBox.bringToFront()
            fillTextBox.bringToFront()
        })

        //on rotating
        fillTextBox.on('rotating', function (e) {
            strokeTextBox.setAngle(fillTextBox.angle)
        })

        //on scaling
        fillTextBox.on('scaling', function (e) {
            strokeTextBox.setWidth(fillTextBox.width)
            strokeTextBox.top = fillTextBox.top - (strokeTextBox.strokeWidth / 2 * fillTextBox.scaleX)
            strokeTextBox.left = fillTextBox.left - (strokeTextBox.strokeWidth / 2 * fillTextBox.scaleY)
        })
    }

    //Set stroke position
    setStrokeLayerPos = (fill, stroke) => {
        stroke.top = fill.top - (stroke.strokeWidth / 2 * fill.scaleX)
        stroke.left = fill.left - (stroke.strokeWidth / 2 * fill.scaleY)
    }

    styleBothLayers = (wantedStyle) => {
        const { fillStyle, strokeStyle } = this.state;

        this.setState({
            fillStyle: {
                ...fillStyle,
                ...wantedStyle
            },

            strokeStyle: {
                ...strokeStyle,
                ...wantedStyle
            }
        }, () => {
            this.matchStateToStyle();
        });


    }

    matchStateToStyle = () => {
        this.state.fillTextBox.set({...this.state.fillStyle});
        this.state.strokeTextBox.set({...this.state.strokeStyle});
        this.props.canvas.renderAll();
    }


    handleAction = (action) => {

        switch(action) {
            case 'remove' : {
                this.props.remove(this);
                break;
            }

            case 'alignTextCenter': {
                this.styleBothLayers({ 'textAlign': 'center' });
                document.getElementById('c').dir='rtl';
                break;
            }

            case 'alignTextRight': {
                this.styleBothLayers({ 'textAlign': 'right' });
                document.getElementById('c').dir='rtl';
                break;
            }

            case 'alignTextLeft': {
                this.styleBothLayers({ 'textAlign': 'left' });
                document.getElementById('c').dir='ltr';
                break;
            }

            case 'makeFontSmaller': {
                const currentFont = parseInt(this.state.fillStyle.fontSize);
                this.styleBothLayers({ 'fontSize': (currentFont - 3) });
                break;
            }

            case 'makeFontLarger': {
                const currentFont = parseInt(this.state.fillStyle.fontSize);
                this.styleBothLayers({'fontSize' : (currentFont + 3)});
                break;
            }

            case 'makeFontBold': {
                this.styleBothLayers({'fontFamily': 'impacta_oebold, impact', opacity: 1});
                break;
            }

            case 'makeFontLight': {
                this.styleBothLayers({ 'fontFamily': 'Open Sans Hebrew', fontWeight: 100 });
                break;
            }

            case 'toggleTextColor': {
                const currentColor = this.state.fillStyle.fill;
                const wantedColor = ((currentColor === colors.BLACK ) ? colors.WHITE : colors.BLACK);
                this.styleBothLayers({'fill': wantedColor, shadow: 0});

                this.setState({ strokeStyle: {
                    ...this.state.strokeStyle,
                    opacity: 0
                }}, () => this.matchStateToStyle())

                break;
            }
        }

        this.props.canvas.renderAll();
    }

    render() {

        return (

            <div className="controllers_wrapper clearfix">

                <textarea placeholder={'טקסט'}
                          value={this.state.textValue}
                          onChange={event => this.onInputChange(event)}
                          type='text'
                          id={Math.random()}
                />

                <div className="flex">
                    {_.map(buttons, button => <MemeTextFieldButton {...button} onClick={() => this.handleAction(button.action)}/>)}
                </div>

            </div>
        )
    }
}



