'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var $ = require('npm-zepto');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var MenuItem = ReactBootstrap.MenuItem;
var Button = ReactBootstrap.Button;
var ButtonInput = ReactBootstrap.ButtonInput;
var Overlay = ReactBootstrap.Overlay;
var Popover = ReactBootstrap.Popover;
var Input = ReactBootstrap.Input;

module.exports = React.createClass({
	displayName: 'EditableDiv',

	propTypes: {
		content: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired,
		onImageUpload: React.PropTypes.func,
		onVideoUpload: React.PropTypes.func,
		tooltipPlacement: React.PropTypes.string
	},

	getDefaultProps: function getDefaultProps() {
		return {
			tooltipPlacement: 'auto'
		};
	},

	getInitialState: function getInitialState() {
		// this is anti-pattern but we treat this.props.content as initial content
		return {
			html: this.props.content,
			showImageTooltip: false,
			showVideoTooltip: false
		};
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({
			html: nextProps.content
		});
	},

	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		return nextProps.content !== this.state.html || nextState.showImageTooltip !== this.state.showImageTooltip || nextState.showVideoTooltip !== this.state.showVideoTooltip;
	},

	_toggleImageTooltip: function _toggleImageTooltip() {
		this.setState({
			showImageTooltip: !this.state.showImageTooltip
		});
	},

	_toggleVideoTooltip: function _toggleVideoTooltip() {
		this.setState({
			showVideoTooltip: !this.state.showVideoTooltip
		});
	},

	_execCommand: function _execCommand(command, arg) {
		document.execCommand(command, false, arg);
	},

	_emitChange: function _emitChange() {
		var editor = this.refs.editor.getDOMNode();
		var newHtml = editor.innerHTML;

		this.setState({ html: newHtml }, (function () {
			this.props.onChange({
				target: {
					value: newHtml
				}
			});
		}).bind(this));
	},

	_onImageSubmit: function _onImageSubmit() {
		var _this = this;

		var files = this.refs.imageInput.getInputDOMNode().files;
		this.props.onImageUpload(files, function (url) {
			_this.refs.editor.getDOMNode().focus();
			_this._execCommand('insertImage', url);
		});
		this._toggleImageTooltip();
	},

	_onVideoSubmit: function _onVideoSubmit() {
		var _this2 = this;

		var files = this.refs.videoInput.getInputDOMNode().files;
		this.props.onVideoUpload(files, function (url) {
			_this2.refs.editor.getDOMNode().focus();
			_this2._execCommand('insertHTML', '<figure><video controls width="400" src="' + url + '">Your browser does not support HTML5 video.</video></figure>');
		});
		this._toggleVideoTooltip();
	},

	render: function render() {
		var _this3 = this;

		// customize css rules here
		var toolbarStyle = { marginBottom: 3 };
		var imgTooltipPlacement = this.props.tooltipPlacement;
		var videoTooltipPlacement = this.props.tooltipPlacement;
		if (imgTooltipPlacement === 'auto') {
			var imgBtn = $('#imgUploadBtn');
			if (imgBtn.length) {
				imgTooltipPlacement = imgBtn.offset().left < 350 ? 'right' : 'left';
			}
		}
		if (videoTooltipPlacement === 'auto') {
			var videoUploadBtn = $('#videoUploadBtn');
			if (videoUploadBtn.length) {
				videoTooltipPlacement = videoUploadBtn.offset().left < 350 ? 'right' : 'left';
			}
		}
		var imageUpload = this.props.onImageUpload === undefined ? null : React.createElement(
			Overlay,
			{
				show: this.state.showImageTooltip,
				onHide: function () {
					return _this3.setState({ showImageTooltip: false });
				},
				placement: imgTooltipPlacement,
				container: this,
				rootClose: true,
				target: function () {
					return _this3.refs.imgUploadBtn.getDOMNode();
				} },
			React.createElement(
				Popover,
				{ id: 'popover', title: 'Image Upload' },
				React.createElement(Input, { type: 'file',
					ref: 'imageInput',
					name: 'file',
					label: 'Select an image to upload'
				}),
				React.createElement(ButtonInput, { type: 'submit', value: 'Submit', onClick: this._onImageSubmit })
			)
		);
		var videoUpload = this.props.onVideoUpload === undefined ? null : React.createElement(
			Overlay,
			{
				show: this.state.showVideoTooltip,
				onHide: function () {
					return _this3.setState({ showVideoTooltip: false });
				},
				placement: videoTooltipPlacement,
				container: this,
				rootClose: true,
				target: function () {
					return _this3.refs.videoUploadBtn.getDOMNode();
				} },
			React.createElement(
				Popover,
				{ id: 'popover', title: 'Video Upload' },
				React.createElement(Input, { type: 'file',
					ref: 'videoInput',
					name: 'file',
					label: 'Select a video to upload'
				}),
				React.createElement(ButtonInput, { type: 'submit', value: 'Submit', onClick: this._onVideoSubmit })
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
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'P') },
							'Paragraph'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE') },
							'Block Quote'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'H1') },
							'Header 1'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'H2') },
							'Header 2'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'H3') },
							'Header 3'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'H4') },
							'Header 4'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'H5') },
							'Header 5'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'formatBlock', 'H6') },
							'Header 6'
						)
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'bold') },
						React.createElement('i', { className: 'fa fa-bold' })
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'italic') },
						React.createElement('i', { className: 'fa fa-italic' })
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'underline') },
						React.createElement('i', { className: 'fa fa-underline' })
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'strikeThrough') },
						React.createElement('i', { className: 'fa fa-strikethrough' })
					),
					React.createElement(
						DropdownButton,
						{ title: React.createElement('i', { className: 'fa fa-text-height' }), id: 'bg-nested-dropdown' },
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 1) },
							'1'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 2) },
							'2'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 3) },
							'3'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 4) },
							'4'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 5) },
							'5'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 6) },
							'6'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'fontSize', 7) },
							'7'
						)
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'insertOrderedList') },
						React.createElement('i', { className: 'fa fa-list-ol' })
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'insertUnorderedList') },
						React.createElement('i', { className: 'fa fa-list-ul' })
					),
					React.createElement(
						DropdownButton,
						{ title: React.createElement('i', { className: 'fa fa-align-left' }), id: 'bg-nested-dropdown' },
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'justifyLeft') },
							'Align Left'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'justifyRight') },
							'Align Right'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'justifyCenter') },
							'Align Center'
						),
						React.createElement(
							MenuItem,
							{ onSelect: this._execCommand.bind(this, 'justifyFull') },
							'Align Justify'
						)
					),
					React.createElement(
						Button,
						{ onClick: this._execCommand.bind(this, 'removeFormat') },
						React.createElement('i', { className: 'fa fa-eraser' })
					),
					React.createElement(
						Button,
						{ ref: 'imgUploadBtn', id: 'imgUploadBtn', onClick: this._toggleImageTooltip },
						React.createElement('i', { className: 'fa fa-picture-o' })
					),
					imageUpload,
					React.createElement(
						Button,
						{ ref: 'videoUploadBtn', id: 'videoUploadBtn', onClick: this._toggleVideoTooltip },
						React.createElement('i', { className: 'fa fa-file-video-o' })
					),
					videoUpload
				)
			),
			React.createElement('div', _extends({
				ref: 'editor',
				className: 'form-control'
			}, this.props, {
				contentEditable: 'true',
				dangerouslySetInnerHTML: { __html: this.state.html },
				onBlur: function (e) {
					if (e.relatedTarget.id === 'imgUploadBtn' || e.relatedTarget.id === 'videoUploadBtn') {
						e.preventDefault();
						_this3.refs.editor.getDOMNode().focus();
					}
				},
				onInput: this._emitChange }))
		);
	}
});
