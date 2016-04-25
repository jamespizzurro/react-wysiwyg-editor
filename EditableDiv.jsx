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
		onVideoUpload: React.PropTypes.func,
		tooltipPlacement: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			tooltipPlacement: 'auto'
		};
	},

	getInitialState: function() {
		// this is anti-pattern but we treat this.props.content as initial content
		return {
			html: this.props.content,
			showImageTooltip: false,
			showVideoTooltip: false
		};
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			html: nextProps.content
		});
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		return nextProps.content !== this.state.html || nextState.showImageTooltip !== this.state.showImageTooltip ||
			nextState.showVideoTooltip !== this.state.showVideoTooltip;
	},

	_toggleImageTooltip: function() {
		this.setState({
			showImageTooltip: !this.state.showImageTooltip
		});
	},

	_toggleVideoTooltip: function() {
		this.setState({
			showVideoTooltip: !this.state.showVideoTooltip
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
		});
		this._toggleImageTooltip();
	},

	_onVideoSubmit: function() {
		var files = this.refs.videoInput.getInputDOMNode().files;
		this.props.onVideoUpload(files, (url) => {
			this.refs.editor.getDOMNode().focus();
			this._execCommand('insertHTML', `<figure><video controls width="400" src="${url}">Your browser does not support HTML5 video.</video></figure>`);
		});
		this._toggleVideoTooltip();
	},

	render: function() {
		// customize css rules here
		var toolbarStyle = {marginBottom: 3};
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
		var imageUpload = this.props.onImageUpload === undefined ? null : (
			<Overlay
				show={this.state.showImageTooltip}
				onHide={() => this.setState({ showImageTooltip: false })}
				placement={imgTooltipPlacement}
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
		var videoUpload = this.props.onVideoUpload === undefined ? null : (
			<Overlay
				show={this.state.showVideoTooltip}
				onHide={() => this.setState({ showVideoTooltip: false })}
				placement={videoTooltipPlacement}
				container={this}
				rootClose={true}
				target={() => this.refs.videoUploadBtn.getDOMNode()} >
				<Popover id="popover" title="Video Upload" >
					<Input type="file"
						ref="videoInput"
						name="file"
						label="Select a video to upload"
					/>
					<ButtonInput type="submit" value="Submit" onClick={this._onVideoSubmit}/>
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
						<Button ref="imgUploadBtn" id="imgUploadBtn" onClick={this._toggleImageTooltip}>
							<i className="fa fa-picture-o"></i>
						</Button>
						{imageUpload}
						<Button ref="videoUploadBtn" id="videoUploadBtn" onClick={this._toggleVideoTooltip}>
							<i className="fa fa-file-video-o"></i>
						</Button>
						{videoUpload}
						<Button onClick={this._execCommand.bind(this, 'createLink')}>
							<i className="fa fa-link"></i>
						</Button>
					</ButtonGroup>
				</div>
				<div
					ref="editor"
					className="form-control"
					{...this.props}
					contentEditable="true"
					dangerouslySetInnerHTML={{__html: this.state.html}}
					onBlur={(e) => {
						if (e.relatedTarget.id === 'imgUploadBtn' || e.relatedTarget.id === 'videoUploadBtn') {
							e.preventDefault();
							this.refs.editor.getDOMNode().focus();
						}
					}}
					onInput={this._emitChange}/>
			</div>
		);
	}
});
