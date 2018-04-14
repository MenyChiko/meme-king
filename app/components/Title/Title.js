import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Title = ({ size, children, className, align, theme, direction, italic }) => {

    const properties = {
        className: classNames(className, `text-${align}`, `theme-${theme}`, size, `direction-${direction}`, 'box-title', { italic })
    }

    switch (size) {
        case 'h1': {
            return <h1 {...properties}>{children}</h1>
        }

        case 'h2':{
            return <h2 {...properties}>{children}</h2>
        }

        case 'h3':{
            return <h3 {...properties}>{children}</h3>
        }

        case 'h4':{
            return <h4 {...properties}>{children}</h4>
        }

        case 'h5':{
            return <h5 {...properties}>{children}</h5>
        }

        case 'h6':{
            return <h6 {...properties}>{children}</h6>
        }
    }
}

Title.defaultProps = {
    size: 'h1',
    children: '',
    align: 'center',
    theme: 'default'
}

Title.propTypes = {
    theme: PropTypes.oneOf(['black', 'white', 'default', 'gray-dark'])
}

export default Title
