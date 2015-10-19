'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var Button = ReactBootstrap.Button;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var Popover = ReactBootstrap.Popover;

module.exports = React.createClass({
	displayName: 'EditableDiv',

	propTypes: {
		content: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},

	getInitialState: function getInitialState() {
		// this is anti-pattern but we treat this.props.content as initial content
		return {
			html: this.props.content,
			paragraphStyle: 'none',
			fontSizeStyle: 'none',
			alignStyle: 'none'
		};
	},

	emitChange: function emitChange() {
		var editor = this.refs.editor.getDOMNode(),
		    newHtml = editor.innerHTML;

		this.setState({ html: newHtml }, (function () {
			this.props.onChange({
				target: {
					value: newHtml
				}
			});
		}).bind(this));
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({
			html: nextProps.content
		});
	},

	shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
		return nextProps.content !== this.state.html;
	},

	execCommand: function execCommand(command, arg) {
		document.execCommand(command, false, arg);
	},

	_createLink: function _createLink() {
		this.execCommand('createLink', this.refs.linkUrl.getDOMNode().value);
	},

	toggleDropdown: function toggleDropdown(dropdown) {
		var dropdownObject = {};
		dropdownObject[dropdown] = this.state[dropdown] === 'none' ? 'block' : 'none';
		this.setState(dropdownObject);
	},

	render: function render() {
		// customize css rules here
		var buttonSpacing = { marginRight: 2 },
		    toolbarStyle = { marginBottom: 3 };
		var createLinkForm = React.createElement(
			'div',
			null,
			React.createElement('input', { type: 'text', ref: 'linkUrl', autofocus: true }),
			React.createElement(
				Button,
				{ onClick: this._createLink },
				'Done'
			)
		);

		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ style: toolbarStyle },
				React.createElement(
					ButtonGroup,
					null,
					React.createElement(
						DropdownButton,
						{ title: React.createElement('i', { className: 'fa fa-paragraph' }), id: 'bg-nested-dropdown' },
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'P') },
							'Paragraph'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE') },
							'Block Quote'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'H1') },
							'Header 1'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'H2') },
							'Header 2'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'H3') },
							'Header 3'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'H4') },
							'Header 4'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'H5') },
							'Header 5'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'formatBlock', 'H6') },
							'Header 6'
						)
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'bold') },
						React.createElement('i', { className: 'fa fa-bold' })
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'italic') },
						React.createElement('i', { className: 'fa fa-italic' })
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'underline') },
						React.createElement('i', { className: 'fa fa-underline' })
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'strikeThrough') },
						React.createElement('i', { className: 'fa fa-strikethrough' })
					),
					React.createElement(
						DropdownButton,
						{ title: React.createElement('i', { className: 'fa fa-text-height' }), id: 'bg-nested-dropdown' },
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 1) },
							'1'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 2) },
							'2'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 3) },
							'3'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 4) },
							'4'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 5) },
							'5'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 6) },
							'6'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'fontSize', 7) },
							'7'
						)
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'insertOrderedList') },
						React.createElement('i', { className: 'fa fa-list-ol' })
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'insertUnorderedList') },
						React.createElement('i', { className: 'fa fa-list-ul' })
					),
					React.createElement(
						DropdownButton,
						{ title: React.createElement('i', { className: 'fa fa-align-left' }), id: 'bg-nested-dropdown' },
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'justifyLeft') },
							'Align Left'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'justifyRight') },
							'Align Right'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'justifyCenter') },
							'Align Center'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this.execCommand.bind(this, 'justifyFull') },
							'Align Justify'
						)
					),
					React.createElement(
						Button,
						{ onClick: this.execCommand.bind(this, 'removeFormat') },
						React.createElement('i', { className: 'fa fa-eraser' })
					)
				)
			),
			React.createElement('div', _extends({
				ref: 'editor',
				className: 'form-control'
			}, this.props, {
				contentEditable: 'true',
				dangerouslySetInnerHTML: { __html: this.state.html },
				onInput: this.emitChange }))
		);
	}
});
