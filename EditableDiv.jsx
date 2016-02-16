'use strict';
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
		imageTooltipPlacement: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			imageTooltipPlacement: 'auto'
		};
	},

	getInitialState: function() {
		// this is anti-pattern but we treat this.props.content as initial content
		return {
			html: this.props.content,
			showTooltip: false
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			html: nextProps.content
		});
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.content !== this.state.html || nextState.showTooltip !== this.state.showTooltip;
	},

	_toggleTooltip: function() {
		this.setState({
			showTooltip: !this.state.showTooltip
		});
	},

	_execCommand: function(command, arg) {
		document.execCommand(command, false, arg);
	},

	_emitChange: function() {
		var editor = this.refs.editor.getDOMNode();
		var newHtml = editor.innerHTML;

		this.setState({html: newHtml}, function() {
			this.props.onChange({
				target: {
					value: newHtml
				}
			});
		}.bind(this));
	},

	_onImageSubmit: function() {
		var files = this.refs.imageInput.getInputDOMNode().files;
		this.props.onImageUpload(files, (url) => {
			this.refs.editor.getDOMNode().focus();
			this._execCommand('insertImage', url);
		}.bind(this));
		this._toggleTooltip();
	},

	render: function() {
		// customize css rules here
		var toolbarStyle = {marginBottom: 3};
		var tooltipPlacement = this.props.imageTooltipPlacement;
		if (tooltipPlacement === 'auto') {
			var imgBtn = $('#imgUploadBtn');
			if (imgBtn.length) {
				tooltipPlacement = imgBtn.offset().left < 350 ? 'right' : 'left';
			}
		}
		var imageUpload = this.props.onImageUpload === undefined ? null : (
			<Overlay
				show={this.state.showTooltip}
				onHide={() => this.setState({ showTooltip: false })}
				placement={tooltipPlacement}
				container={this}
				rootClose={true}
				target={() => this.refs.imgUploadBtn.getDOMNode()} >
				<Popover id="popover" title="Image Upload" >
					<Input type="file"
						ref="imageInput"
						name="file"
						label="Select an image to upload"
					/>
					<ButtonInput type="submit" value="Submit" onClick={this._onImageSubmit}/>
				</Popover>
			</Overlay>
		);

		return (
			<div>
				<div style={toolbarStyle}>
					<ButtonGroup>
						<DropdownButton title={<i className="fa fa-paragraph"></i>} id="bg-nested-dropdown">
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'P')}>Paragraph</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'BLOCKQUOTE')}>Block Quote</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H1')}>Header 1</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H2')}>Header 2</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H3')}>Header 3</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H4')}>Header 4</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H5')}>Header 5</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'formatBlock', 'H6')}>Header 6</MenuItem>
						</DropdownButton>
						<Button onClick={this._execCommand.bind(this, 'bold')}>
							<i className="fa fa-bold"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'italic')}>
							<i className="fa fa-italic"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'underline')}>
							<i className="fa fa-underline"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'strikeThrough')}>
							<i className="fa fa-strikethrough"></i>
						</Button>
						<DropdownButton title={<i className="fa fa-text-height"></i>} id="bg-nested-dropdown">
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 1)}>1</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 2)}>2</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 3)}>3</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 4)}>4</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 5)}>5</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 6)}>6</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'fontSize', 7)}>7</MenuItem>
						</DropdownButton>
						<Button onClick={this._execCommand.bind(this, 'insertOrderedList')}>
							<i className="fa fa-list-ol"></i>
						</Button>
						<Button onClick={this._execCommand.bind(this, 'insertUnorderedList')}>
							<i className="fa fa-list-ul"></i>
						</Button>
						<DropdownButton title={<i className="fa fa-align-left"></i>} id="bg-nested-dropdown">
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyLeft')}>Align Left</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyRight')}>Align Right</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyCenter')}>Align Center</MenuItem>
							<MenuItem onSelect={this._execCommand.bind(this, 'justifyFull')}>Align Justify</MenuItem>
						</DropdownButton>
						<Button onClick={this._execCommand.bind(this, 'removeFormat')}>
							<i className="fa fa-eraser"></i>
						</Button>
						<Button ref="imgUploadBtn" id="imgUploadBtn" onClick={this._toggleTooltip}>
							<i className="fa fa-picture-o"></i>
						</Button>
						{imageUpload}
					</ButtonGroup>
				</div>
				<div
					ref="editor"
					className="form-control"
					{...this.props}
					contentEditable="true"
					dangerouslySetInnerHTML={{__html: this.state.html}}
					onBlur={(e) => {
						if (e.relatedTarget.id === 'imgUploadBtn') {
							e.preventDefault();
							this.refs.editor.getDOMNode().focus();
						}
					}}
					onInput={this._emitChange}/>
			</div>
		);
	}
});
